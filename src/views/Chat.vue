<template>
  <div class="chatContainer">
    <div id="message-container">
      <Chato :message="msg" v-for="msg in messageArray" :key="msg"></Chato>
      <!-- <div class="message" v-for="msg in messageArray" :key="msg">
        {{msg}}
    </div> -->
    </div>
    <input
      id="chat-input"
      @keyup="sendMessage"
      v-model="chatInput"
      type="text"
    />
    <button type="button" @click="appended" id="send-message">send</button>
  </div>
</template>

<script>
// import Vue from 'vue/dist/vue.esm'
import Chato from "@/components/Chato.vue";
import { io } from "socket.io-client";
import { postJsonData, getJsonData } from "./utils";
export default {
  components: {
    Chato,
  },
  data() {
    return {
      range: 0,
      chatInput: "hello you",
      messageArray: [],
      message: "",
      messageObject: {},
      socket: io(),
      randomName: "",
    };
  },
  methods: {
    appended() {
      //   this.messageObject.content = this.chatInput;
      //   this.messageObject.sender = "anonymous";
      //   this.messageObject.date = new Date();

      var today = new Date();
      var date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date + " " + time;
      //   this.messageObject.time = time;

      let messageObject = {
        content: this.chatInput,
        sender: this.randomName,
        date: today,
        time: time,
      };
      this.socket.emit("sendMessage", messageObject);
      //   this.messageArray.push(this.messageObject);
      //   console.log(this.messageArray);
      //   this.chatInput=""
    },
    sendMessage(event) {
      if (event.keyCode === 13) {
        document.getElementById("send-message").click();
      }
    },
    ho() {
      console.log("object");
    },
  },
  watch: {
    chatInput: function(val) {
      if (val.includes("kartik")) {
        this.chatInput = "kartik noob developer";
      }
      if (val.includes("vinay")) {
        this.chatInput = "vinay is the best";
      }
      if (val.includes("shruti")) {
        this.chatInput = "shruti noob loser bronze tier";
      }
      let object={
          content:val,
          sender: this.randomName
      }
      this.socket.emit('chatInput',object)
    },
  },
  async mounted() {
    this.socket.on("newMessage", (data) => {
      console.log("new message");
      this.messageArray.push(data);
      this.$nextTick(() => {
        var objDiv = document.getElementById("message-container");
        objDiv.scrollTop = objDiv.scrollHeight;
      });
    });
    this.socket.on("newUserJoined", (data) => {
      let object = {
        content: data,
      };
      this.messageArray.push(object);
      this.$nextTick(() => {
        var objDiv = document.getElementById("message-container");
        objDiv.scrollTop = objDiv.scrollHeight;
      });
    });
    let user = await getJsonData("/api/checkLogin");
    if(user.status==1){
        this.randomName=user.username
    }else{
            this.randomName = Math.round(Math.random() * 100);
    this.randomName = "anonymous" + this.randomName;
    }

    
    let response = await getJsonData("/api/getMessage");
    this.messageArray = response;
    this.messageArray = this.messageArray.reverse();
    this.socket.emit("newUser", this.randomName);
    this.$nextTick(() => {
      var objDiv = document.getElementById("message-container");
      objDiv.scrollTop = objDiv.scrollHeight;
    });
    console.log(response);
  },
};
</script>

<style>
#message-container {
  height: 200px;
  border-style: solid;
  overflow-x: hidden;
  overflow-y: auto;
  text-align: justify;
}
</style>
