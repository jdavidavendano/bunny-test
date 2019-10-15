<template>
  <div class="container">
    <div class="row vertical-centre justify-content-center mt-50">
      <div class="col-md-6 mx-auto">
        <CreateUser></CreateUser>
        <ListUsers></ListUsers>
        <ListTasks></ListTasks>
      </div>
    </div>
  </div>
</template>

<script>
import CreateUser from "./components/createUser.vue";
import ListUsers from "./components/listUsers.vue";
import ListTasks from "./components/listTasks.vue";


export default {
  name: "app",
  components: { CreateUser, ListUsers, ListTasks }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/bootstrap";
@import "node_modules/bootstrap-vue/src/index.scss";
.vertical-centre {
  min-height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
}
.user__row {
  width: 400px;
}
</style>
