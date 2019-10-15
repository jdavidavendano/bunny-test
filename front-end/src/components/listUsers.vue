<template>
    <div>
        <div v-bind:show="users.length>0" class="col align-self-center">
            <div class="form-row align-items-center" v-for="user in users">
                <div class='inline'>
                    <p>{{ user.name }}</p>
                    <b-button @click="showModalUpdateName(user)">Edit user</b-button>
                    <div v-on:click="deleteUser(user.id)" class='delete'>Delete user</div>
                </div>
            </div>
            <div
            class="alert alert-primary user__row"
            v-show="users.length==0 && doneLoading"
            >
                There are not users.
            </div>
        </div>
        <div>
            <!-- modal edit user name -->
            <b-modal 
            id="modalUserName"
            title="Submit Your Name"
            @hidden="resetModal"
            @ok="handleOk"
            >
                <form ref="form" @submit.stop.prevent="handleSubmit">
                    <b-form-group
                    label-for="name-input"
                    invalid-feedback="Name is required"
                    >
                    New name for {{ selectedUser.name }}
                    <b-form-input
                        id="name-input"
                        v-model="newNameForm"
                        required
                    ></b-form-input>
                    </b-form-group>
                </form>
            </b-modal>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import bus from "./../bus.js";

export default {
    data() {
        return {
            users: [],
            newNameForm: '',
            selectedUser: '',
            doneLoading: false
        };
    },
    created: function() {
        this.fetchUsers();
        this.listenToEvents();
    },
    watch: {
        $route: function() {
            let self = this;
            self.doneLoading = false;
            self.fetchData().then(function() {
                self.doneLoading = true;
            });
        }
    },
    methods: {
        fetchUsers() {
            this.$http.get("/").then(response => {
                this.users = response.data;
            });
        },

        updateUser(newName, user) {
            let userWithNewName = {
                'id': user.id,
                'name': newName
            }
            this.$http.put(`/${user.id}`, userWithNewName).then(
                response => {
                    this.fetchUsers();
                }
            ).catch(
                error => {
                    console.error(error);
                }
            );
        },

        deleteUser(id) {
            this.$http.delete(`/${id}`).then(
                response => {
                    this.fetchUsers();
                }
            );
        },

        listenToEvents() {
            bus.$on("refreshUser", $event => {
                this.fetchUsers(); 
            });
        },

        showModalUpdateName(user) {
            this.selectedUser = user;
            this.$root.$emit('bv::show::modal', 'modalUserName', '#btnShow');
        },

        hideModal() {
            this.selectedUser = '';
            this.newNameForm = '';
            this.$root.$emit('bv::hide::modal', 'modalUserName', '#btnShow');
        },

        checkFormValidity() {
            return this.newNameForm.length > 0;
        },

        resetModal() {;
            this.selectedUser = '';
            this.newNameForm = '';
        },

        handleOk(bvModalEvt) {
            bvModalEvt.preventDefault();
            this.handleSubmit();
        },

        handleSubmit() {
            // Exit when the form isn't valid
            if (!this.checkFormValidity()) {
                return
            }
            
            this.updateUser(this.newNameForm,this.selectedUser)
            
            this.hideModal()
            this.$nextTick(() => {
                this.hideModal()
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.no_border_left_right {
  border-left: 0px;
  border-right: 0px;
}

.flat_form {
  border-radius: 0px;
}

.mrb-10 {
  margin-bottom: 10px;
}

.addon-left {
  background-color: none !important;
  border-left: 0px !important;
  cursor: pointer !important;
}

.addon-right {
  background-color: none !important;
  border-right: 0px !important;
}

.inline {
    display: flex;
    flex-direction: row;
    margin: 0.5rem;
}

.inline > button {
    margin-left: 0.3rem;
}

.delete {
    background-color: #F00;
    border-radius: 0.2rem;
    margin: 0rem 1rem 0.7rem 1rem;
    padding: 0 0.1rem;
    cursor: pointer;
}
</style>
