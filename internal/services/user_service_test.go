package services

import (
    "testing"
    "time"
    "github.com/google/uuid"
    "github.com/stretchr/testify/require"
    sqlite "github.com/glebarez/sqlite"
    "gorm.io/gorm"
    "github.com/purnama354/sejiwa-api/internal/models"
    "github.com/purnama354/sejiwa-api/internal/repository"
)

func setupTestDB(t *testing.T) *gorm.DB {
    db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
    require.NoError(t, err)
    err = db.AutoMigrate(&models.User{}, &models.UserPreferences{}, &models.Category{}, &models.Thread{}, &models.Reply{}, &models.Report{}, &models.SavedThread{}, &models.CategorySubscription{})
    require.NoError(t, err)
    return db
}

func TestPreferencesDefaultCreation(t *testing.T) {
    db := setupTestDB(t)
    urepo := repository.NewUserRepository(db)
    prepo := repository.NewPreferencesRepository(db)
    trepo := repository.NewThreadRepository(db)
    rrepo := repository.NewReplyRepository(db)
    repo := repository.NewReportRepository(db)
    srepo := repository.NewSubscriptionRepository(db)
    svrepo := repository.NewSavedThreadRepository(db)
    catrepo := repository.NewCategoryRepository(db)

    svc := NewUserService(urepo, prepo, trepo, rrepo, repo, srepo, svrepo, catrepo)
    uid := uuid.New()
    user := &models.User{BaseModel: models.BaseModel{ID: uid}, Username: "alice", Password: "x", Role: models.RoleUser, Status: models.StatusActive}
    require.NoError(t, urepo.Create(user))

    pref, err := svc.GetPreferences(uid)
    require.NoError(t, err)
    require.True(t, pref.NotifyThreadReplies)
    require.True(t, pref.NotifyMentions)
}

func TestStatsAggregation(t *testing.T) {
    db := setupTestDB(t)
    urepo := repository.NewUserRepository(db)
    prepo := repository.NewPreferencesRepository(db)
    trepo := repository.NewThreadRepository(db)
    rrepo := repository.NewReplyRepository(db)
    repo := repository.NewReportRepository(db)
    srepo := repository.NewSubscriptionRepository(db)
    svrepo := repository.NewSavedThreadRepository(db)
    catrepo := repository.NewCategoryRepository(db)
    svc := NewUserService(urepo, prepo, trepo, rrepo, repo, srepo, svrepo, catrepo)

    uid := uuid.New()
    user := &models.User{BaseModel: models.BaseModel{ID: uid}, Username: "bob", Password: "x", Role: models.RoleUser, Status: models.StatusActive}
    now := time.Now()
    user.LastActiveAt = &now
    require.NoError(t, urepo.Create(user))

    cat := &models.Category{Name: "Anxiety", Slug: "anxiety"}
    require.NoError(t, db.Create(cat).Error)
    thr := &models.Thread{Title: "t1", Content: "abc", AuthorID: uid, CategoryID: cat.ID}
    require.NoError(t, db.Create(thr).Error)

    stats, err := svc.GetMyStats(uid)
    require.NoError(t, err)
    require.Equal(t, 1, stats.ThreadsCreated)
}
