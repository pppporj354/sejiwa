
package repository

import (
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/purnama354/sejiwa-api/internal/models"
	"github.com/purnama354/sejiwa-api/internal/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func TestSubscriptionRepository_Subscribe(t *testing.T) {
	db := testutils.SetupTestDB(t)
	repo := NewSubscriptionRepository(db)

	// Create test user and category
	user := &models.User{
		BaseModel: models.BaseModel{ID: uuid.New()},
		Username:  "testuser",
		Email:     "test@example.com",
		Password:  "hashedpassword",
		Role:      models.RoleUser,
		Status:    models.StatusActive,
	}
	require.NoError(t, db.Create(user).Error)

	category := &models.Category{
		BaseModel:   models.BaseModel{ID: uuid.New()},
		Name:        "Test Category",
		Slug:        "test-category",
		Description: "Test description",
	}
	require.NoError(t, db.Create(category).Error)

	tests := []struct {
		name        string
		userID      uuid.UUID
		categoryID  uuid.UUID
		expectError bool
	}{
		{
			name:        "successful subscription",
			userID:      user.ID,
			categoryID:  category.ID,
			expectError: false,
		},
		{
			name:        "duplicate subscription",
			userID:      user.ID,
			categoryID:  category.ID,
			expectError: true, // Should fail due to unique constraint
		},
		{
			name:        "invalid user ID",
			userID:      uuid.New(),
			categoryID:  category.ID,
			expectError: true,
		},
		{
			name:        "invalid category ID",
			userID:      user.ID,
			categoryID:  uuid.New(),
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := repo.Subscribe(tt.userID, tt.categoryID)

			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)

				// Verify subscription was created
				var subscription models.CategorySubscription
				err = db.Where("user_id = ? AND category_id = ?", tt.userID, tt.categoryID).First(&subscription).Error
				assert.NoError(t, err)
				assert.Equal(t, tt.userID, subscription.UserID)
				assert.Equal(t, tt.categoryID, subscription.CategoryID)
			}
		})
	}
}

func TestSubscriptionRepository_Unsubscribe(t *testing.T) {
	db := testutils.SetupTestDB(t)
	repo := NewSubscriptionRepository(db)

	// Create test user and category
	user := &models.User{
		ID:       uuid.New().String(),
		Username: "testuser",
		Email:    "test@example.com",
	}
	require.NoError(t, db.Create(user).Error)

	category := &models.Category{
		ID:   uuid.New().String(),
		Name: "Test Category",
		Slug: "test-category",
	}
	require.NoError(t, db.Create(category).Error)

	// Create subscription
	subscription := &models.CategorySubscription{
		UserID:     user.ID,
		CategoryID: category.ID,
	}
	require.NoError(t, db.Create(subscription).Error)

	tests := []struct {
		name        string
		userID      string
		categoryID  string
		expectError bool
	}{
		{
			name:        "successful unsubscription",
			userID:      user.ID,
			categoryID:  category.ID,
			expectError: false,
		},
		{
			name:        "unsubscribe non-existent subscription",
			userID:      user.ID,
			categoryID:  uuid.New().String(),
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := repo.Unsubscribe(tt.userID, tt.categoryID)

			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)

				// Verify subscription was deleted
				var count int64
				db.Model(&models.CategorySubscription{}).Where("user_id = ? AND category_id = ?", tt.userID, tt.categoryID).Count(&count)
				assert.Equal(t, int64(0), count)
			}
		})
	}
}

func TestSubscriptionRepository_ListByUser(t *testing.T) {
	db := testutils.SetupTestDB(t)
	repo := NewSubscriptionRepository(db)

	// Create test user
	user := &models.User{
		ID:       uuid.New().String(),
		Username: "testuser",
		Email:    "test@example.com",
	}
	require.NoError(t, db.Create(user).Error)

	// Create test categories
	categories := []models.Category{
		{ID: uuid.New().String(), Name: "Category 1", Slug: "category-1"},
		{ID: uuid.New().String(), Name: "Category 2", Slug: "category-2"},
		{ID: uuid.New().String(), Name: "Category 3", Slug: "category-3"},
	}
	for _, category := range categories {
		require.NoError(t, db.Create(&category).Error)
	}

	// Create subscriptions for first two categories
	for i := 0; i < 2; i++ {
		subscription := &models.CategorySubscription{
			UserID:     user.ID,
			CategoryID: categories[i].ID,
		}
		require.NoError(t, db.Create(subscription).Error)
	}

	// Test listing subscriptions
	result, err := repo.ListByUser(user.ID)
	assert.NoError(t, err)
	assert.Len(t, result, 2)

	// Verify category details are loaded
	for _, category := range result {
		assert.NotEmpty(t, category.Name)
		assert.NotEmpty(t, category.Slug)
	}

	// Test with non-existent user
	result, err = repo.ListByUser("non-existent-user")
	assert.NoError(t, err)
	assert.Len(t, result, 0)
}

func TestSubscriptionRepository_IsSubscribed(t *testing.T) {
	db := testutils.SetupTestDB(t)
	repo := NewSubscriptionRepository(db)

	// Create test user and category
	user := &models.User{
		ID:       uuid.New().String(),
		Username: "testuser",
		Email:    "test@example.com",
	}
	require.NoError(t, db.Create(user).Error)

	category := &models.Category{
		ID:   uuid.New().String(),
		Name: "Test Category",
		Slug: "test-category",
	}
	require.NoError(t, db.Create(category).Error)

	// Test not subscribed initially
	isSubscribed, err := repo.IsSubscribed(user.ID, category.ID)
	assert.NoError(t, err)
	assert.False(t, isSubscribed)

	// Create subscription
	subscription := &models.CategorySubscription{
		UserID:     user.ID,
		CategoryID: category.ID,
	}
	require.NoError(t, db.Create(subscription).Error)

	// Test subscribed after creation
	isSubscribed, err = repo.IsSubscribed(user.ID, category.ID)
	assert.NoError(t, err)
	assert.True(t, isSubscribed)
}

func TestSavedThreadRepository_Save(t *testing.T) {
	db := testutils.SetupTestDB(t)
	repo := NewSavedThreadRepository(db)

	// Create test user, category, and thread
	user := &models.User{
		ID:       uuid.New().String(),
		Username: "testuser",
		Email:    "test@example.com",
	}
	require.NoError(t, db.Create(user).Error)

	category := &models.Category{
		ID:   uuid.New().String(),
		Name: "Test Category",
		Slug: "test-category",
	}
	require.NoError(t, db.Create(category).Error)

	thread := &models.Thread{
		ID:         uuid.New().String(),
		Title:      "Test Thread",
		Content:    "Test content",
		AuthorID:   user.ID,
		CategoryID: category.ID,
	}
	require.NoError(t, db.Create(thread).Error)

	tests := []struct {
		name        string
		userID      string
		threadID    string
		expectError bool
	}{
		{
			name:        "successful save",
			userID:      user.ID,
			threadID:    thread.ID,
			expectError: false,
		},
		{
			name:        "duplicate save",
			userID:      user.ID,
			threadID:    thread.ID,
			expectError: true, // Should fail due to unique constraint
		},
		{
			name:        "invalid thread ID",
			userID:      user.ID,
			threadID:    "invalid-thread-id",
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := repo.Save(tt.userID, tt.threadID)

			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)

				// Verify saved thread was created
				var savedThread models.SavedThread
				err = db.Where("user_id = ? AND thread_id = ?", tt.userID, tt.threadID).First(&savedThread).Error
				assert.NoError(t, err)
				assert.Equal(t, tt.userID, savedThread.UserID)
				assert.Equal(t, tt.threadID, savedThread.ThreadID)
			}
		})
	}
}

func TestSavedThreadRepository_Unsave(t *testing.T) {
	db := testutils.SetupTestDB(t)
	repo := NewSavedThreadRepository(db)

	// Create test user, category, and thread
	user := &models.User{
		ID:       uuid.New().String(),
		Username: "testuser",
		Email:    "test@example.com",
	}
	require.NoError(t, db.Create(user).Error)

	category := &models.Category{
		ID:   uuid.New().String(),
		Name: "Test Category",
		Slug: "test-category",
	}
	require.NoError(t, db.Create(category).Error)

	thread := &models.Thread{
		ID:         uuid.New().String(),
		Title:      "Test Thread",
		Content:    "Test content",
		AuthorID:   user.ID,
		CategoryID: category.ID,
	}
	require.NoError(t, db.Create(thread).Error)

	// Create saved thread
	savedThread := &models.SavedThread{
		UserID:   user.ID,
		ThreadID: thread.ID,
	}
	require.NoError(t, db.Create(savedThread).Error)

	tests := []struct {
		name        string
		userID      string
		threadID    string
		expectError bool
	}{
		{
			name:        "successful unsave",
			userID:      user.ID,
			threadID:    thread.ID,
			expectError: false,
		},
		{
			name:        "unsave non-existent saved thread",
			userID:      user.ID,
			threadID:    uuid.New().String(),
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := repo.Unsave(tt.userID, tt.threadID)

			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)

				// Verify saved thread was deleted
				var count int64
				db.Model(&models.SavedThread{}).Where("user_id = ? AND thread_id = ?", tt.userID, tt.threadID).Count(&count)
				assert.Equal(t, int64(0), count)
			}
		})
	}
}

func TestSavedThreadRepository_ListByUser(t *testing.T) {
	db := testutils.SetupTestDB(t)
	repo := NewSavedThreadRepository(db)

	// Create test user
	user := &models.User{
		ID:       uuid.New().String(),
		Username: "testuser",
		Email:    "test@example.com",
	}
	require.NoError(t, db.Create(user).Error)

	// Create test category
	category := &models.Category{
		ID:   uuid.New().String(),
		Name: "Test Category",
		Slug: "test-category",
	}
	require.NoError(t, db.Create(category).Error)

	// Create test threads
	threads := make([]models.Thread, 15) // Create 15 threads for pagination testing
	for i := 0; i < 15; i++ {
		threads[i] = models.Thread{
			ID:         uuid.New().String(),
			Title:      "Test Thread " + string(rune(i+1)),
			Content:    "Test content",
			AuthorID:   user.ID,
			CategoryID: category.ID,
		}
		require.NoError(t, db.Create(&threads[i]).Error)

		// Save the first 12 threads
		if i < 12 {
			savedThread := &models.SavedThread{
				UserID:   user.ID,
				ThreadID: threads[i].ID,
			}
			savedThread.CreatedAt = time.Now().Add(-time.Duration(i) * time.Hour) // Different times for ordering
			require.NoError(t, db.Create(savedThread).Error)
		}
	}

	tests := []struct {
		name           string
		userID         string
		page           int
		limit          int
		expectedCount  int
		expectedTotal  int64
		expectedHasNext bool
		expectedHasPrev bool
	}{
		{
			name:            "first page with limit 10",
			userID:          user.ID,
			page:            1,
			limit:           10,
			expectedCount:   10,
			expectedTotal:   12,
			expectedHasNext: true,
			expectedHasPrev: false,
		},
		{
			name:            "second page with limit 10",
			userID:          user.ID,
			page:            2,
			limit:           10,
			expectedCount:   2,
			expectedTotal:   12,
			expectedHasNext: false,
			expectedHasPrev: true,
		},
		{
			name:            "limit 5",
			userID:          user.ID,
			page:            1,
			limit:           5,
			expectedCount:   5,
			expectedTotal:   12,
			expectedHasNext: true,
			expectedHasPrev: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			threads, total, err := repo.ListByUser(tt.userID, tt.page, tt.limit)
			assert.NoError(t, err)
			assert.Len(t, threads, tt.expectedCount)
			assert.Equal(t, tt.expectedTotal, total)

			// Verify thread and author details are loaded
			for _, thread := range threads {
				assert.NotEmpty(t, thread.Title)
				assert.NotEmpty(t, thread.Author.Username)
				assert.NotEmpty(t, thread.Category.Name)
			}

			// Test pagination metadata
			hasNext := (tt.page * tt.limit) < int(total)
			hasPrev := tt.page > 1
			assert.Equal(t, tt.expectedHasNext, hasNext)
			assert.Equal(t, tt.expectedHasPrev, hasPrev)
		})
	}

	// Test with non-existent user
	threads, total, err := repo.ListByUser("non-existent-user", 1, 10)
	assert.NoError(t, err)
	assert.Len(t, threads, 0)
	assert.Equal(t, int64(0), total)
}

func TestSavedThreadRepository_IsSaved(t *testing.T) {
	db := testutils.SetupTestDB(t)
	repo := NewSavedThreadRepository(db)

	// Create test user, category, and thread
	user := &models.User{
		ID:       uuid.New().String(),
		Username: "testuser",
		Email:    "test@example.com",
	}
	require.NoError(t, db.Create(user).Error)

	category := &models.Category{
		ID:   uuid.New().String(),
		Name: "Test Category",
		Slug: "test-category",
	}
	require.NoError(t, db.Create(category).Error)

	thread := &models.Thread{
		ID:         uuid.New().String(),
		Title:      "Test Thread",
		Content:    "Test content",
		AuthorID:   user.ID,
		CategoryID: category.ID,
	}
	require.NoError(t, db.Create(thread).Error)

	// Test not saved initially
	isSaved, err := repo.IsSaved(user.ID, thread.ID)
	assert.NoError(t, err)
	assert.False(t, isSaved)

	// Create saved thread
	savedThread := &models.SavedThread{
		UserID:   user.ID,
		ThreadID: thread.ID,
	}
	require.NoError(t, db.Create(savedThread).Error)

	// Test saved after creation
	isSaved, err = repo.IsSaved(user.ID, thread.ID)
	assert.NoError(t, err)
	assert.True(t, isSaved)
}
