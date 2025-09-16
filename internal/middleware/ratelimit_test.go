package middleware

import (
    "net/http"
    "net/http/httptest"
    "testing"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/ulule/limiter/v3"
)

func TestNewRateLimiter_AllowsWithinLimit(t *testing.T) {
    gin.SetMode(gin.TestMode)
    rate := limiter.Rate{Period: time.Second, Limit: 5}
    rl := NewRateLimiter(rate)

    r := gin.New()
    r.GET("/", rl, func(c *gin.Context) { c.Status(http.StatusOK) })

    for i := range 5 {
        w := httptest.NewRecorder()
        req := httptest.NewRequest(http.MethodGet, "/", nil)
        r.ServeHTTP(w, req)
        if w.Code != http.StatusOK {
            t.Fatalf("expected 200 within limit, got %d on i=%d", w.Code, i)
        }
    }
}
