package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

type GreetingResponse struct {
	Title     string `json:"title"`
	Message   string `json:"message"`
	Signature string `json:"signature"`
	Accent    string `json:"accent"`
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/greeting", greetingHandler)

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
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	response := GreetingResponse{
		Title:     "Happy Birthday, My Favorite Person",
		Message:   "ขอให้วันเกิดปีนี้อบอุ่น สดใส และเต็มไปด้วยความสุขในทุกช่วงเวลา อย่าได้มีสักวันเลยที่ต้องอยู่อย่างทุกข์ใจ เหมือนช่อดอกแคสเปียที่พลิ้วไหวเบา ๆ แต่ทำให้ทั้งวันดูละมุนขึ้นทันที",
		Signature: "With all my heart, Love you always",
		Accent:    "ช่อดอกแคสเปียสีม่วงพาสเทล",
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	_ = json.NewEncoder(w).Encode(response)
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
