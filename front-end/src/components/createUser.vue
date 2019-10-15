
<template>
  <div class="col align-self-center">
    <h3 class="pb-5 text-left underline">Create user</h3>
    <form class="sign-in" @submit.prevent>
      <div class="form-group todo__row">
        <input
          type="text"
          class="form-control"
          @keypress="typing=true"
          placeholder="Type the name of the new user"
          v-model="name"
          @keyup.enter="addUser($event)"
        />
        <small class="form-text text-muted" v-show="typing">Hit enter to save</small>
      </div>
    </form>
  </div>
</template>
<script>
    import axios from "axios";
    import bus from "./../bus.js";

    export default {
    data() {
        return {
        name: "",
        typing: false
        };
    },
    methods: {
        addUser(event) {
        if (event) event.preventDefault();
        let user = {
            name: this.name
        };
        console.log(user);
        this.$http
            .post("/", user,{
            headers: {
                // remove headers
                }
            })
            .then(response => {
            this.clearUser();
            this.refreshUSer();
            this.typing = false;
            })
            .catch(error => {
            console.log(error);
            });
        },

        clearUser() {
        this.name = "";
        },

        refreshUSer() {
        bus.$emit("refreshUser");
        }
    }
};
</script>
<style lang="scss" scoped>
.underline {
  text-decoration: underline;
}
</style>

