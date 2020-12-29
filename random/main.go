package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/go-redis/redis"
)

var (
	client = redis.NewClient(&redis.Options{
		Addr:     "localhost:6378", // host:port of the redis server
		Password: "",               // no password set
		DB:       0,                // use default DB
	})
	ctx = context.TODO()
)

func main() {
	// client := redis.NewClient(&redis.Options{
	// 	Addr:     "localhost:6378", // host:port of the redis server
	// 	Password: "",               // no password set
	// 	DB:       0,                // use default DB
	// })
	// ctx := context.TODO()
	// client.Set(ctx, "language", "Go", 0)
	// language := client.Get(ctx, "language")

	// fmt.Println(language.Val()) // "Go"
	// fmt.Println(client.Exists(ctx, "language").Val())

	// http.HandleFunc("/api/getroom", func(w http.ResponseWriter, r *http.Request) {
	// 	data, err := ioutil.ReadAll(r.Body)
	// 	if err != nil {
	// 		http.Error(w, err.Error(), http.StatusBadRequest)
	// 		return
	// 	}
	// 	for k, v := range r.URL.Query() {
	// 		fmt.Print(k, " ")
	// 		fmt.Printf(" key %#v - val %#v  - type %T\n", k, v, v)
	// 		fmt.Println("vals")
	// 		for _, vv := range v {
	// 			fmt.Println(vv)
	// 		}
	// 	}
	// 	fmt.Println(r.URL.Query().Get("room"))

	// 	fmt.Println(data)
	// 	// fmt.Fprint(w, r.Body)
	// })
	http.HandleFunc("/api/room_exists", roomExists)
	http.HandleFunc("/api/room_history", getRoomChat)
	http.HandleFunc("/api/set_room", setRoom)
	http.HandleFunc("/api/notify", notify)
	err := http.ListenAndServe(":8000", nil)
	fmt.Println(err)

}

func notify(w http.ResponseWriter, r *http.Request) {
	room_id := r.URL.Query().Get("room")
	go notifyUsers(room_id)
}

func setRoom(w http.ResponseWriter, r *http.Request) {
	room_id := r.URL.Query().Get("room")
	//chck in rdb
	client.Set(ctx, room_id, "", 0) // some expiry for the room
	fmt.Fprint(w, []string{})
}

func getRoomChat(w http.ResponseWriter, r *http.Request) {
	room_id := r.URL.Query().Get("room")
	fmt.Println("rorom ", room_id)
	//chck in rdb
	str := client.Get(ctx, room_id).Val()
	fmt.Println("out from redis", str)
	arr := strings.Split(str, "(##)")
	fmt.Println(arr, len(arr), "is arr len")
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
			fmt.Println("couldnt marshal ", idata)
			continue
		}
		final = append(final, string(bytes))
	}

	fmt.Println("r his ", final)
	z, err := json.Marshal(Messages{final})
	if err != nil {
		fmt.Println("could marshal")
		return
	}

	fmt.Fprint(w, string(z))
}

func roomExists(w http.ResponseWriter, r *http.Request) {
	room_id := r.URL.Query().Get("room")
	//chck in rdb

	if client.Exists(ctx, room_id).Val() == 1 {
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

func notifyUsers(room_id string) {
	//telegram bot notfication
	fmt.Println("NOTIFYING>........")
}

// package main

// import (
// 	"encoding/json"
// 	"fmt"
// )

// type Messages struct {
// 	Messages []string `json:"messages"`
// }

// func main() {
// 	mess := Messages{
// 		[]string{"a", "b", "c"},
// 	}
// 	val, err := json.Marshal(mess)
// 	if err != nil {
// 		return
// 	}
// 	var mess2 Messages
// 	_ = json.Unmarshal(val, &mess2)
// 	fmt.Printf("%#v", mess2)
// }

// package main

// func main() {
// 	//TELEGRAM INTEGRATION
// 	//1438018537:AAEQ99sjkBqPK_97lOcrNgK0cdCXCRhVNGE
// 	//grimble_bot
// 	// https://api.telegram.org/bot1438018537:AAEQ99sjkBqPK_97lOcrNgK0cdCXCRhVNGE/getme
// 	// https://api.telegram.org/bot1438018537:AAEQ99sjkBqPK_97lOcrNgK0cdCXCRhVNGE/getUpdates
// 	notifyUsers("room_123445")
// 	// sendApi := "https://api.telegram.org/bot1438018537:AAEQ99sjkBqPK_97lOcrNgK0cdCXCRhVNGE/sendMessage?chat_id=%s&text=TestReply"

// }
