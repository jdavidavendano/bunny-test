<template>
    <div v-if="showable">
        <div class="col align-self-center">
            <h3 class="pb-5 text-left underline">Create task (user: {{ currentUser.name }})</h3>
            <!-- form create tasks -->
            <form class="sign-in" @submit.prevent>
            <div class="form-group todo__row">
                <input
                type="text"
                class="form-control"
                @keypress="typing=true"
                placeholder="Type the new task"
                v-model="taskDescription"
                @keyup.enter="addTask($event)"
                />
                <small class="form-text text-muted" v-show="typing">Hit enter to save</small>
            </div>
            </form>
        </div>
        <!-- section list tasks -->
        <div v-bind:show="tasks.length>0" class="col align-self-center">
            <div class="form-row align-items-center" v-for="task in tasks">
                <div class='inline'>
                    <p><span :class=task.state class='clickeable' v-on:click="updateTask(null, task.state, task)">{{ task.state }}</span>{{ task.description }}</p>
                    <b-button @click="showModalUpdateTask(task)">Edit task</b-button>
                </div>
            </div>
            <div
            class="alert alert-primary user__row"
            v-show="tasks.length==0"
            >
                There are not tasks.
            </div>
        </div>
        <div>
            <!-- modal edit task description -->
            <b-modal 
            id="modalTasks"
            title="Edit your task"
            @hidden="resetModalTask"
            @ok="handleOkTask"
            >
                <form ref="form" @submit.stop.prevent="handleSubmit">
                    <b-form-group
                    label-for="description-input"
                    invalid-feedback="Description is required"
                    >
                    New description, old: {{ selectedTask.description }}
                    <b-form-input
                        id="description-input"
                        
                        v-model="newDescriptionForm"
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
import EventBus from "./../bus.js";



export default {
    data() {
        return {
            tasks: [],
            newDescriptionForm: '',
            selectedTask: '',
            doneLoading: false,
            taskDescription: "",
            typing: false,
            task: '',
            showable: false,
            currentUser: ''
        };
    },
    created: function() {
        this.fetchTasks();
        this.listenToEvents();
        EventBus.$on('user-id-to-tasks', user=>{
            this.getUserByBus(user);
        })
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
        getUserByBus(user){
            // Communication between templates
            this.currentUser = user;
            this.showable = true;
            this.fetchTasks();
        },
        
        addTask(event) {
            if (event) event.preventDefault();
            let newTask = {
                description: this.taskDescription,
                state: 'to-do',
                user_id: this.currentUser.id
            };

            this.$httpTasks
                .post("/", newTask,{
                    headers: {
                        // remove headers
                    }
                })
                .then(response => {
                    if(response != null){
                        this.clearTask();
                        this.refreshTask();
                        this.typing = false;
                        this.fetchTasks();
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },

        clearTask() {
            this.taskDescription = "";
        },

        refreshTask() {
            EventBus.$emit("refreshTask");
        }, 

        fetchTasks() {
            let idTmp = this.currentUser.id;
            this.$httpTasks.get("/"+idTmp).then(response => {
                this.tasks = response.data;
            });
        },

        updateTask(newDescription, newState, task) {
            let taskUpdated;
            if(newState == null){
                // Only update description
                taskUpdated = {
                    'id': task.id,
                    'description': newDescription,
                    'state': task.state,
                    'user_id': task.user_id
                }
            }

            if(newDescription == null){
                // Only update status
                if(newState == 'to-do'){
                    // Switch status
                    taskUpdated = {
                        'id': task.id,
                        'description': task.description,
                        'state': 'done',
                        'user_id': task.user_id
                    }
                } else {
                    taskUpdated = {
                        'id': task.id,
                        'description': task.description,
                        'state': 'to-do',
                        'user_id': task.user_id
                    }
                }
            }
            
            this.$httpTasks.put(`/${task.id}`, taskUpdated).then(
                response => {
                    if(response != null){
                        this.fetchTasks();
                    }
                }
            ).catch(
                error => {
                    console.error(error);
                }
            );
        },

        listenToEvents() {
            EventBus.$on("refreshUser", $event => {
                this.fetchTasks(); 
            });
        },
        /* Modal things */
        showModalUpdateTask(task) {
            this.selectedTask = task;
            this.$root.$emit('bv::show::modal', 'modalTasks', '#btnShow');
        },

        hideModalUpdateTask() {
            this.selectedUser = '';
            this.newDescriptionForm = '';
            this.$root.$emit('bv::hide::modal', 'modalTasks', '#btnShow');
        },

        checkFormValidity() {
            return this.newDescriptionForm.length > 0;
        },

        resetModalTask() {;
            this.selectedTask = '';
            this.newDescriptionForm = '';
        },

        handleOkTask(bvModalEvt) {
            bvModalEvt.preventDefault();
            this.handleSubmit();
        },

        handleSubmit() {
            // Exit when the form isn't valid
            if (!this.checkFormValidity()) {
                return
            }
            
            this.updateTask(this.newDescriptionForm, null, this.selectedTask)
            
            this.hideModalUpdateTask()
            this.$nextTick(() => {
                this.hideModalUpdateTask()
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

.clickeable {
    cursor: pointer;
    border-width: 2px;
    border-style: solid;
    border-radius: 0.2rem;
    padding: 0.1rem;
}

.to-do {
    color: #F60;
    margin-right: 1rem;
    border-color: #F60; 
}

.done{
    color: #0F0;
    margin-right: 1rem;
    border-color: #0F0; 
}
</style>
