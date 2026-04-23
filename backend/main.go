package main

import (
	// "context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/resend/resend-go/v2"
)

type GreetingResponse struct {
	Title     string `json:"title"`
	Message   string `json:"message"`
	Signature string `json:"signature"`
	Accent    string `json:"accent"`
}

type SendWishRequest struct {
	Name    string `json:"name"`
	Message string `json:"message"`
}

type SendWishResponse struct {
	OK bool `json:"ok"`
}

func main() {
	mux := http.NewServeMux()

	// ของเก่า
	mux.HandleFunc("/api/greeting", greetingHandler)

	// ของใหม่
	mux.HandleFunc("/api/send-wish", sendWishHandler)

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

// ===== ของเก่า: greeting endpoint =====

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

// ===== ของใหม่: ส่งคำอวยพรเข้าอีเมล =====

func sendWishHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	defer r.Body.Close()

	var req SendWishRequest
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

	if err := sendWishEmail(req); err != nil {
		log.Printf("send wish email error: %v", err)
		http.Error(w, "failed to send email", http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, SendWishResponse{
		OK: true,
	})
}

func validateWish(req SendWishRequest) error {
	if req.Name == "" {
		return errors.New("name is required")
	}
	if req.Message == "" {
		return errors.New("message is required")
	}
	if len([]rune(req.Name)) > 100 {
		return errors.New("name is too long")
	}
	if len([]rune(req.Message)) > 1500 {
		return errors.New("message is too long")
	}
	return nil
}

func sendWishEmail(req SendWishRequest) error {
	apiKey := os.Getenv("RESEND_API_KEY")
	emailFrom := os.Getenv("EMAIL_FROM")
	emailTo := os.Getenv("EMAIL_TO")

	if apiKey == "" {
		return errors.New("RESEND_API_KEY is required")
	}
	if emailFrom == "" {
		return errors.New("EMAIL_FROM is required")
	}
	if emailTo == "" {
		return errors.New("EMAIL_TO is required")
	}

	client := resend.NewClient(apiKey)

	subject := fmt.Sprintf("New Birthday Wish from %s 🎂", req.Name)

	textBody := fmt.Sprintf(
		"มีคำอวยพรใหม่จากเว็บไซต์\n\nชื่อ: %s\n\nข้อความ:\n%s\n",
		req.Name,
		req.Message,
	)

	htmlBody := fmt.Sprintf(`
		<div style="font-family:Arial,sans-serif;line-height:1.6;color:#241b3a;">
			<h2 style="margin-bottom:8px;">มีคำอวยพรใหม่จากเว็บไซต์ 🎉</h2>
			<p><strong>ชื่อ:</strong> %s</p>
			<p><strong>ข้อความ:</strong></p>
			<div style="padding:12px 14px;background:#f8f2ff;border-radius:12px;white-space:pre-wrap;">%s</div>
		</div>
	`, escapeHTML(req.Name), escapeHTML(req.Message))

	params := &resend.SendEmailRequest{
		From:    emailFrom,
		To:      []string{emailTo},
		Subject: subject,
		Text:    textBody,
		Html:    htmlBody,
	}

	_, err := client.Emails.Send(params)
	return err
}

// ===== ของเก่า: CORS middleware =====

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

// ===== helper functions =====

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func escapeHTML(s string) string {
	replacer := strings.NewReplacer(
		"&", "&amp;",
		"<", "&lt;",
		">", "&gt;",
		`"`, "&quot;",
		"'", "&#39;",
	)
	return replacer.Replace(s)
}
