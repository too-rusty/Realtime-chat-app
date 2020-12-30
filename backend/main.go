package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/go-redis/redis"
)

var addr = flag.String("addr", ":4000", "http service address")

// func serveHome(w http.ResponseWriter, r *http.Request) {
// 	log.Println(r.URL)
// 	if r.URL.Path != "/" {
// 		http.Error(w, "Not found", http.StatusNotFound)
// 		return
// 	}
// 	if r.Method != "GET" {
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}
// 	http.ServeFile(w, r, "home.html")
// }

var (
	redisClient = redis.NewClient(&redis.Options{
		Addr:     "db:6379", // host:port of the redis server
		Password: "",        // no password set
		DB:       0,         // use default DB
	})
	ctx             = context.TODO()
	ChatHistoryChan = make(chan []byte)
)

func init() {
	// fmt.Println("always run at the start")
}
func main() {
	flag.Parse()
	hub := NewHub()
	go hub.run()
	go appender()
	// http.HandleFunc("/", serveHome)
	http.HandleFunc("/api/ping", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "pong2")
	})
	http.HandleFunc("/api/ping2", func(w http.ResponseWriter, r *http.Request) {
		pong, err := redisClient.Ping(ctx).Result()
		if err != nil {
			fmt.Fprint(w, "couldnt connect", err.Error())
			return
		}
		fmt.Fprint(w, pong)
	})
	http.HandleFunc("/api/room_exists", roomExists)
	http.HandleFunc("/api/room_history", getRoomChat)
	http.HandleFunc("/api/set_room", setRoom)
	http.HandleFunc("/api/notify", notify)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		ServeWs(hub, w, r)
	})
	err := http.ListenAndServe(*addr, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func notify(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	room_id := r.URL.Query().Get("room")
	go notifyUsers(room_id)
}

func setRoom(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	room_id := r.URL.Query().Get("room")
	//chck in rdb
	redisClient.Set(ctx, room_id, "", time.Hour*10) // some expiry for the room
	fmt.Fprint(w, []string{})
}

func getRoomChat(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	room_id := r.URL.Query().Get("room")

	//chck in rdb
	str := redisClient.Get(ctx, room_id).Val()
	arr := strings.Split(str, "(##)")
	final := make([]string, 0)
	for _, v := range arr {
		if v == "" {
			continue
		}
		vs := strings.Split(v, "(#)")
		idata := IncomingData{
			User: vs[0],
			Text: vs[1],
			Room: room_id,
		}
		bytes, err := json.Marshal(idata)
		if err != nil {
			log.Println("couldnt marshal ", idata)
			fmt.Println("couldnt marshal ", idata)
			continue
		}
		final = append(final, string(bytes))
	}

	// fmt.Println("r his ", final)
	z, err := json.Marshal(Messages{final})
	if err != nil {
		log.Println("couldnt marshal")
		fmt.Println("could marshal")
		return
	}

	fmt.Fprint(w, string(z))
}

func roomExists(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	room_id := r.URL.Query().Get("room")
	//chck in rdb

	if redisClient.Exists(ctx, room_id).Val() == 1 {
		//it exists
		fmt.Fprint(w, true)
	} else {
		fmt.Fprint(w, false)
	}

}

type Messages struct {
	Messages []string `json:"messages"`
}

type RedisData struct {
	User string `json:"user"`
	Text string `json:"text"`
}

type IncomingData struct {
	User string `json:"user"`
	Text string `json:"text"`
	Room string `json:"room"`
}
type TeleInfo struct {
	id, name string
}

var telegramIds = []TeleInfo{
	TeleInfo{"461440768", "anni"},
	TeleInfo{"1251611898", "jibran"},
	TeleInfo{"784954453", "saurav"},
}

func notifyUsers(room_id string) {
	//telegram bot notfication
	sendApi := "https://api.telegram.org/bot1438018537:AAEQ99sjkBqPK_97lOcrNgK0cdCXCRhVNGE/sendMessage?chat_id=%s&text=%s"

	links := make([]string, 0)
	for _, v := range telegramIds {
		message := fmt.Sprintf("Hi %s , please join room id : %s", v.name, room_id)
		links = append(links, fmt.Sprintf(sendApi, v.id, message))
		log.Println("notifying")
		fmt.Println("NOTIFYING ", v.name)
	}
	//send request to all
	_ = links
	for _, link := range links {

		r, _ := http.Get(link)
		_ = r
	}
}

func appender() {
	// kkep on appending to the redis db

	for {
		message := <-ChatHistoryChan
		log.Println("appending ", string(message))
		fmt.Println(string(message))
		var idata IncomingData
		err := json.Unmarshal(message, &idata)
		if err != nil {
			//do nothing
			fmt.Println("cant append", string(message))
			continue
		}
		mydata := redisClient.Get(ctx, idata.Room).Val()
		mydata = keepOnly(100)(mydata)
		if mydata != "" {
			mydata += "(##)"
		}

		mydata += (idata.User + "(#)" + idata.Text)
		redisClient.Set(ctx, idata.Room, mydata, time.Hour*10)

	}
}

func keepOnly(n int) func(string) string {
	return func(s string) string {
		arr := strings.Split(s, "(##)")
		if len(arr) > n {
			arr = arr[len(arr)-n : len(arr)]
		}
		return strings.Join(arr, "(##)")

	}
}

/*

may create same room
useless api calls
improper data storage and retrieval
wrong logic while room creation, async all might happen after
manual telegram id feed
listeners data not stored in db
no db integration
better styling
make db
logging
failure recovery
encryption
*/

//https://www.codementor.io/@garethdwyer/building-a-telegram-bot-using-python-part-1-goi5fncay
