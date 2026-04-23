package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type GreetingResponse struct {
	Title     string `json:"title"`
	Message   string `json:"message"`
	Signature string `json:"signature"`
	Accent    string `json:"accent"`
}

type CreateWishRequest struct {
	Name    string `json:"name"`
	Message string `json:"message"`
}

type CreateWishResponse struct {
	OK bool `json:"ok"`
}

var db *sql.DB

func main() {
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		log.Fatal("DB_DSN is required")
	}

	var err error
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("open db: %v", err)
	}

	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		log.Fatalf("ping db: %v", err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/api/greeting", greetingHandler)
	mux.HandleFunc("/api/wishes", wishesHandler)

	handler := corsMiddleware(mux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("birthday api running on :%s\n", port)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatal(err)
	}
}

func greetingHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	writeJSON(w, http.StatusOK, GreetingResponse{
		Title:     "Happy Birthday, My Favorite Person",
		Message:   "ขอให้วันเกิดปีที่33นี้อบอุ่น สดใส และเต็มไปด้วยความสุขในทุกช่วงเวลา",
		Signature: "With all my heart, love you always.",
		Accent:    "ช่อดอกแคสเปียสีม่วงพาสเทล",
	})
}

func wishesHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		createWishHandler(w, r)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func createWishHandler(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	var req CreateWishRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json body", http.StatusBadRequest)
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Message = strings.TrimSpace(req.Message)

	if err := validateWish(req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
	defer cancel()

	_, err := db.ExecContext(
		ctx,
		`INSERT INTO birthday_wishes (name, message) VALUES (?, ?)`,
		req.Name,
		req.Message,
	)
	if err != nil {
		log.Printf("insert wish: %v", err)
		http.Error(w, "failed to save wish", http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusCreated, CreateWishResponse{OK: true})
}

func validateWish(req CreateWishRequest) error {
	if req.Name == "" {
		return errors.New("name is required")
	}
	if req.Message == "" {
		return errors.New("message is required")
	}
	if len([]rune(req.Name)) > 100 {
		return errors.New("name is too long")
	}
	if len([]rune(req.Message)) > 1000 {
		return errors.New("message is too long")
	}
	return nil
}

func corsMiddleware(next http.Handler) http.Handler {
	allowedOrigin := os.Getenv("ALLOWED_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:3000"
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
