package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/purnama354/sejiwa-api/internal/dto"
	"github.com/purnama354/sejiwa-api/internal/middleware"
	"github.com/purnama354/sejiwa-api/internal/models"
	"github.com/purnama354/sejiwa-api/internal/services"
	"github.com/purnama354/sejiwa-api/internal/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// MockUserService for testing - implementing the actual interface
type MockUserService struct {
	mock.Mock
}

// JoinCategory implements services.UserService.
func (m *MockUserService) JoinCategory(userID uuid.UUID, categoryID uuid.UUID, password *string) error {
	panic("unimplemented")
}

func (m *MockUserService) GetUserProfile(userID uuid.UUID) (*dto.UserProfile, error) {
	args := m.Called(userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*dto.UserProfile), args.Error(1)
}

func (m *MockUserService) UpdateUserProfile(userID uuid.UUID, req dto.UpdateUserRequest) (*dto.UserProfile, error) {
	args := m.Called(userID, req)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*dto.UserProfile), args.Error(1)
}

func (m *MockUserService) ListUsers(role *models.UserRole, status *models.UserStatus, query *string, offset, limit int) ([]models.User, int64, error) {
	args := m.Called(role, status, query, offset, limit)
	return args.Get(0).([]models.User), args.Get(1).(int64), args.Error(2)
}

func (m *MockUserService) GetPreferences(userID uuid.UUID) (*models.UserPreferences, error) {
	args := m.Called(userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.UserPreferences), args.Error(1)
}

func (m *MockUserService) UpdateNotificationPreferences(userID uuid.UUID, req dto.UpdateNotificationPreferencesRequest) (*models.UserPreferences, error) {
	args := m.Called(userID, req)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.UserPreferences), args.Error(1)
}

func (m *MockUserService) UpdatePrivacySettings(userID uuid.UUID, req dto.UpdatePrivacySettingsRequest) (*models.UserPreferences, error) {
	args := m.Called(userID, req)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.UserPreferences), args.Error(1)
}

func (m *MockUserService) GetMyStats(userID uuid.UUID) (*dto.UserStatsResponse, error) {
	args := m.Called(userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*dto.UserStatsResponse), args.Error(1)
}

func (m *MockUserService) GetMyActivity(userID uuid.UUID) (*dto.UserActivityResponse, error) {
	args := m.Called(userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*dto.UserActivityResponse), args.Error(1)
}

func (m *MockUserService) GetMyCategories(userID uuid.UUID) ([]dto.CategorySubscription, error) {
	args := m.Called(userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]dto.CategorySubscription), args.Error(1)
}

func (m *MockUserService) SubscribeCategory(userID, categoryID uuid.UUID) error {
	args := m.Called(userID, categoryID)
	return args.Error(0)
}

func (m *MockUserService) UnsubscribeCategory(userID, categoryID uuid.UUID) error {
	args := m.Called(userID, categoryID)
	return args.Error(0)
}

func (m *MockUserService) ListSavedThreads(userID uuid.UUID, offset, limit int) ([]dto.ThreadPreview, int64, error) {
	args := m.Called(userID, offset, limit)
	if args.Get(0) == nil {
		return nil, args.Get(1).(int64), args.Error(2)
	}
	return args.Get(0).([]dto.ThreadPreview), args.Get(1).(int64), args.Error(2)
}

func (m *MockUserService) SaveThread(userID, threadID uuid.UUID) error {
	args := m.Called(userID, threadID)
	return args.Error(0)
}

func (m *MockUserService) UnsaveThread(userID, threadID uuid.UUID) error {
	args := m.Called(userID, threadID)
	return args.Error(0)
}

func setupUsersHandler() (*UserHandler, *MockUserService) {
	mockService := &MockUserService{}
	handler := NewUserHandler(mockService)
	return handler, mockService
}

func TestUserHandler_SubscribeCategory(t *testing.T) {
	handler, mockService := setupUsersHandler()
	gin.SetMode(gin.TestMode)

	userUUID := uuid.New()
	categoryUUID := uuid.New()

	tests := []struct {
		name           string
		body           map[string]interface{}
		userID         uuid.UUID
		mockSetup      func()
		expectedStatus int
		checkResponse  func(t *testing.T, body string)
	}{
		{
			name:   "successful subscription",
			body:   map[string]interface{}{"category_id": categoryUUID.String()},
			userID: userUUID,
			mockSetup: func() {
				mockService.On("SubscribeCategory", userUUID, categoryUUID).Return(nil)
			},
			expectedStatus: http.StatusOK,
			checkResponse: func(t *testing.T, body string) {
				assert.Contains(t, body, `"subscribed":true`)
			},
		},
		{
			name:   "invalid request body",
			body:   map[string]interface{}{"invalid": "data"},
			userID: userUUID,
			mockSetup: func() {
				// No mock setup needed for validation failure
			},
			expectedStatus: http.StatusUnprocessableEntity,
			checkResponse:  func(t *testing.T, body string) {},
		},
		{
			name:   "service error",
			body:   map[string]interface{}{"category_id": categoryUUID.String()},
			userID: userUUID,
			mockSetup: func() {
				mockService.On("SubscribeCategory", userUUID, categoryUUID).Return(services.ErrCategoryNotFound)
			},
			expectedStatus: http.StatusInternalServerError,
			checkResponse:  func(t *testing.T, body string) {},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Reset mock
			mockService.Mock = mock.Mock{}
			tt.mockSetup()

			// Create request
			bodyBytes, _ := json.Marshal(tt.body)
			req := httptest.NewRequest(http.MethodPost, "/api/v1/users/me/subscriptions", bytes.NewReader(bodyBytes))
			req.Header.Set("Content-Type", "application/json")

			// Create response recorder
			w := httptest.NewRecorder()

			// Create Gin context
			c, _ := gin.CreateTestContext(w)
			c.Request = req
			c.Set(middleware.ContextUserIDKey, tt.userID)

			// Call handler
			handler.SubscribeCategory(c)

			// Assertions
			assert.Equal(t, tt.expectedStatus, w.Code)
			tt.checkResponse(t, w.Body.String())

			mockService.AssertExpectations(t)
		})
	}
}



func TestUserHandler_UnsubscribeCategory(t *testing.T) {
	handler, mockService := setupUsersHandler()
	gin.SetMode(gin.TestMode)

	userUUID := uuid.New()
	categoryUUID := uuid.New()
	invalidCategoryUUID := uuid.New()

	tests := []struct {
		name           string
		body           interface{}
		userID         uuid.UUID
		categoryID     uuid.UUID
		mockSetup      func()
		expectedStatus int
		expectedBody   string
	}{
		{
			name:   "successful unsubscription",
			body:   dto.UnsubscribeRequest{CategoryID: categoryUUID.String()},
			userID: userUUID,
			categoryID: categoryUUID,
			mockSetup: func() {
				mockService.On("UnsubscribeCategory", userUUID, categoryUUID).Return(nil)
			},
			expectedStatus: http.StatusOK,
			expectedBody:   `{"success":true,"message":"Successfully unsubscribed from category"}`,
		},
		{
			name:   "category not found",
			body:   dto.UnsubscribeRequest{CategoryID: invalidCategoryUUID.String()},
			userID: userUUID,
			categoryID: invalidCategoryUUID,
			mockSetup: func() {
				mockService.On("UnsubscribeCategory", userUUID, invalidCategoryUUID).Return(services.ErrCategoryNotFound)
			},
			expectedStatus: http.StatusNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Reset mock
			mockService.Mock = mock.Mock{}
			tt.mockSetup()

			// Create request
			bodyBytes, _ := json.Marshal(tt.body)
			req := httptest.NewRequest(http.MethodDelete, "/api/v1/users/me/subscriptions", bytes.NewReader(bodyBytes))
			req.Header.Set("Content-Type", "application/json")

			// Create response recorder
			w := httptest.NewRecorder()

			// Create Gin context
			c, _ := gin.CreateTestContext(w)
			c.Request = req
			c.Set(middleware.ContextUserIDKey, tt.userID)

			// Call handler
			handler.UnsubscribeCategory(c)

			// Assertions
			assert.Equal(t, tt.expectedStatus, w.Code)
			if tt.expectedBody != "" {
				assert.JSONEq(t, tt.expectedBody, w.Body.String())
			}

			mockService.AssertExpectations(t)
		})
	}
}

func TestUserHandler_SaveThread(t *testing.T) {
	handler, mockService := setupUsersHandler()
	gin.SetMode(gin.TestMode)

	userUUID := uuid.New()
	threadUUID := uuid.New()
	invalidThreadUUID := uuid.New()

	tests := []struct {
		name           string
		body           interface{}
		userID         uuid.UUID
		threadID       uuid.UUID
		mockSetup      func()
		expectedStatus int
		expectedBody   string
	}{
		{
			name:   "successful thread save",
			body:   dto.SaveThreadRequest{ThreadID: threadUUID.String()},
			userID: userUUID,
			threadID: threadUUID,
			mockSetup: func() {
				mockService.On("SaveThread", userUUID, threadUUID).Return(nil)
			},
			expectedStatus: http.StatusOK,
			expectedBody:   `{"success":true,"message":"Thread saved successfully"}`,
		},
		{
			name:   "thread not found",
			body:   dto.SaveThreadRequest{ThreadID: invalidThreadUUID.String()},
			userID: userUUID,
			threadID: invalidThreadUUID,
			mockSetup: func() {
				mockService.On("SaveThread", userUUID, invalidThreadUUID).Return(services.ErrThreadNotFound)
			},
			expectedStatus: http.StatusNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Reset mock
			mockService.Mock = mock.Mock{}
			tt.mockSetup()

			// Create request
			bodyBytes, _ := json.Marshal(tt.body)
			req := httptest.NewRequest(http.MethodPost, "/api/v1/users/me/saved-threads", bytes.NewReader(bodyBytes))
			req.Header.Set("Content-Type", "application/json")

			// Create response recorder
			w := httptest.NewRecorder()

			// Create Gin context
			c, _ := gin.CreateTestContext(w)
			assert.Equal(t, tt.expectedStatus, w.Code)
			if tt.expectedBody != "" {
				assert.JSONEq(t, tt.expectedBody, w.Body.String())
			}

			mockService.AssertExpectations(t)
		})
	}
}

func TestUserHandler_UnsaveThread(t *testing.T) {
			handler.SaveThread(c)

			// Assertions
			assert.Equal(t, tt.expectedStatus, w.Code)
			if tt.expectedBody != "" {
				assert.JSONEq(t, tt.expectedBody, w.Body.String())
func TestUserHandler_UnsaveThread(t *testing.T) {
	handler, mockService := setupUsersHandler()
	gin.SetMode(gin.TestMode)

	userUUID := uuid.New()
	threadUUID := uuid.New()
	invalidThreadUUID := uuid.New()

	tests := []struct {
		name           string
		body           interface{}
		userID         uuid.UUID
		threadID       uuid.UUID
		mockSetup      func()
		expectedStatus int
		expectedBody   string
	}{
		{
			name:   "successful thread unsave",
			body:   dto.UnsaveThreadRequest{ThreadID: threadUUID.String()},
			userID: userUUID,
			threadID: threadUUID,
			mockSetup: func() {
				mockService.On("UnsaveThread", userUUID, threadUUID).Return(nil)
			},
			expectedStatus: http.StatusOK,
			expectedBody:   `{"success":true,"message":"Thread unsaved successfully"}`,
		},
		{
			name:   "thread not found",
			body:   dto.UnsaveThreadRequest{ThreadID: invalidThreadUUID.String()},
			userID: userUUID,
			threadID: invalidThreadUUID,
			mockSetup: func() {
				mockService.On("UnsaveThread", userUUID, invalidThreadUUID).Return(services.ErrThreadNotFound)
			},
			expectedStatus: http.StatusNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Reset mock
			mockService.Mock = mock.Mock{}
			tt.mockSetup()

			// Create request
			bodyBytes, _ := json.Marshal(tt.body)
			req := httptest.NewRequest(http.MethodDelete, "/api/v1/users/me/saved-threads", bytes.NewReader(bodyBytes))
			assert.Equal(t, tt.expectedStatus, w.Code)
			if tt.expectedBody != "" {
				assert.JSONEq(t, tt.expectedBody, w.Body.String())
			}

			mockService.AssertExpectations(t)
		})
	}
}

func TestUserHandler_ListSavedThreads(t *testing.T) {

			// Create Gin context
			c, _ := gin.CreateTestContext(w)
			c.Request = req
			c.Set(middleware.ContextUserIDKey, tt.userID)

			// Call handler
			handler.UnsaveThread(c)

			// Assertions
			assert.Equal(t, tt.expectedStatus, w.Code)
			if tt.expectedBody != "" {
				assert.JSONEq(t, tt.expectedBody, w.Body.String())
			}

			mockService.AssertExpectations(t)
		})
	}
}

func TestUserHandler_ListSavedThreads(t *testing.T) {
	handler, mockService := setupUsersHandler()
	gin.SetMode(gin.TestMode)

	mockResponse := &dto.SavedThreadsResponse{
		Threads: []dto.ThreadPreview{
			{
				ID:           "thread-1",
				Title:        "Test Thread",
				AuthorName:   "Test User",
				CategoryName: "Test Category",
				SavedAt:      "2024-01-01T00:00:00Z",
			},
		},
		Pagination: dto.PaginationResponse{
			CurrentPage: 1,
			TotalPages:  1,
			TotalItems:  1,
			HasNext:     false,
			HasPrev:     false,
		},
	}

	userUUID := uuid.New()

	tests := []struct {
		name           string
		query          string
		userID         uuid.UUID
		mockSetup      func()
		expectedStatus int
	}{
		{
			name:   "successful list with default params",
			query:  "",
			userID: userUUID,
			mockSetup: func() {
				mockService.On("ListSavedThreads", userUUID, 1, 10).Return(mockResponse, nil)
			},
			expectedStatus: http.StatusOK,
		},
		{
			name:   "successful list with custom params",
			query:  "?page=2&limit=5",
			userID: userUUID,
			mockSetup: func() {
				mockService.On("ListSavedThreads", userUUID, 2, 5).Return(mockResponse, nil)
			},
			expectedStatus: http.StatusOK,
		},
		{
			name:   "service error",
			query:  "",
			userID: userUUID,
			mockSetup: func() {
				mockService.On("ListSavedThreads", userUUID, 1, 10).Return(nil, testutils.ErrDatabase)
			},
			expectedStatus: http.StatusInternalServerError,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockService.AssertExpectations(t)
		})
	}
}

func TestUserHandler_UpdateNotificationPreferences(t *testing.T) {
			// Create request
			req := httptest.NewRequest(http.MethodGet, "/api/v1/users/me/saved-threads"+tt.query, nil)

			// Create response recorder
			w := httptest.NewRecorder()

			// Create Gin context
			c, _ := gin.CreateTestContext(w)
			c.Request = req
			c.Set(middleware.ContextUserIDKey, tt.userID)

			// Call handler
			handler.ListSavedThreads(c)

			// Assertions
			assert.Equal(t, tt.expectedStatus, w.Code)

			mockService.AssertExpectations(t)
		})
	}
func TestUserHandler_UpdateNotificationPreferences(t *testing.T) {
	handler, mockService := setupUsersHandler()
	gin.SetMode(gin.TestMode)

	userUUID := uuid.New()

	tests := []struct {
		name           string
		body           interface{}
		userID         uuid.UUID
		mockSetup      func()
		expectedStatus int
		expectedBody   string
	}{
		{
			name: "successful preferences update",
			body: dto.UpdateNotificationPreferencesRequest{
				EmailNotifications: true,
				PushNotifications:  false,
			},
			userID: userUUID,
			mockSetup: func() {
				req := dto.UpdateNotificationPreferencesRequest{
					EmailNotifications: true,
					PushNotifications:  false,
				}
				mockService.On("UpdateNotificationPreferences", userUUID, req).Return(&models.UserPreferences{}, nil)
			},
			expectedStatus: http.StatusOK,
			expectedBody:   `{"success":true,"message":"Notification preferences updated successfully"}`,
		},
		{
			name:   "invalid request body",
			body:   "invalid json",
			userID: userUUID,
			mockSetup: func() {
				// No mock setup needed for validation failure
			},
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Reset mock
			mockService.Mock = mock.Mock{}
			tt.mockSetup()

			// Create request
			bodyBytes, _ := json.Marshal(tt.body)
			req := httptest.NewRequest(http.MethodPut, "/api/v1/users/me/preferences/notifications", bytes.NewReader(bodyBytes))
			req.Header.Set("Content-Type", "application/json")

			// Create response recorder
			w := httptest.NewRecorder()

			// Create Gin context
			c, _ := gin.CreateTestContext(w)
			c.Request = req
			c.Set(middleware.ContextUserIDKey, tt.userID)

			// Call handler
			handler.UpdateNotificationPreferences(c)

			// Assertions
			assert.Equal(t, tt.expectedStatus, w.Code)
			if tt.expectedBody != "" {
				assert.JSONEq(t, tt.expectedBody, w.Body.String())
			}

			mockService.AssertExpectations(t)
		})
	}
}
			req.Header.Set("Content-Type", "application/json")

			// Create response recorder
			w := httptest.NewRecorder()

			// Create Gin context
			c, _ := gin.CreateTestContext(w)
			c.Request = req
			c.Set("userID", tt.userID)

			// Call handler
			handler.UpdateNotificationPreferences(c)

			// Assertions
			assert.Equal(t, tt.expectedStatus, w.Code)
			if tt.expectedBody != "" {
				assert.JSONEq(t, tt.expectedBody, w.Body.String())
			}

			mockService.AssertExpectations(t)
		})
	}
}
