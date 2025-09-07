package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/purnama354/sejiwa-api/internal/dto"
	"github.com/purnama354/sejiwa-api/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

const (
	ContextUserIDKey = "userID"

	ContextUserRoleKey = "userRole"
)

// AuthMiddleware creates a Gin middleware for JWT authentication.
func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			err := dto.NewErrorResponse("Authorization header missing", "AUTH_HEADER_MISSING", nil)
			if rid := GetRequestID(c); rid != "" {
				err.RequestID = rid
			}
			c.AbortWithStatusJSON(http.StatusUnauthorized, err)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			err := dto.NewErrorResponse("Invalid authorization header format", "AUTH_HEADER_INVALID_FORMAT", nil)
			if rid := GetRequestID(c); rid != "" {
				err.RequestID = rid
			}
			c.AbortWithStatusJSON(http.StatusUnauthorized, err)
			return
		}

		tokenString := parts[1]
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(jwtSecret), nil
		})

		if err != nil {
			errRes := dto.NewErrorResponse("Invalid token", "TOKEN_INVALID", nil)
			if rid := GetRequestID(c); rid != "" {
				errRes.RequestID = rid
			}
			c.AbortWithStatusJSON(http.StatusUnauthorized, errRes)
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			userIDStr, ok := claims["sub"].(string)
			if !ok {
				errRes := dto.NewErrorResponse("Invalid subject claim", "TOKEN_CLAIM_INVALID_SUB", nil)
				if rid := GetRequestID(c); rid != "" {
					errRes.RequestID = rid
				}
				c.AbortWithStatusJSON(http.StatusUnauthorized, errRes)
				return
			}

			userID, err := uuid.Parse(userIDStr)
			if err != nil {
				errRes := dto.NewErrorResponse("Invalid subject claim format", "TOKEN_CLAIM_INVALID_SUB_FORMAT", nil)
				if rid := GetRequestID(c); rid != "" {
					errRes.RequestID = rid
				}
				c.AbortWithStatusJSON(http.StatusUnauthorized, errRes)
				return
			}

			userRole, ok := claims["role"].(string)
			if !ok {
				errRes := dto.NewErrorResponse("Invalid role claim", "TOKEN_CLAIM_INVALID_ROLE", nil)
				if rid := GetRequestID(c); rid != "" {
					errRes.RequestID = rid
				}
				c.AbortWithStatusJSON(http.StatusUnauthorized, errRes)
				return
			}

			c.Set(ContextUserIDKey, userID)
			c.Set(ContextUserRoleKey, models.UserRole(userRole))
			c.Next()
		} else {
			errRes := dto.NewErrorResponse("Invalid token", "TOKEN_INVALID", nil)
			if rid := GetRequestID(c); rid != "" {
				errRes.RequestID = rid
			}
			c.AbortWithStatusJSON(http.StatusUnauthorized, errRes)
		}
	}
}
