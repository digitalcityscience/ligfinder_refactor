<template>
<v-scroll-x-transition>
    <div class="user-ui" >
        <div v-if="$store.state.user.loggedIn==false">
            <v-tabs v-model="tab" show-arrows background-color="cyan accent-4" icons-and-text dark grow >
                <v-tabs-slider color="purple darken-4"></v-tabs-slider>
                <v-tab v-for="i in tabs" :key="i.name">
                    <v-icon medium>{{ i.icon }}</v-icon>
                    <div class="caption py-1">{{ i.name }}</div>
                </v-tab>
                <v-tab-item>
                    <v-card >
                        <v-card-text>
                            <v-form ref="loginForm" v-model="valid" lazy-validation>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field v-model="loginEmail" :rules="loginEmailRules" :label="$t('user.email')" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field v-model="loginPassword" :append-icon="show1?'mdi-eye':'mdi-eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" :label="$t('user.password')" hint="At least 8 characters" counter @click:append="show1 = !show1"></v-text-field>
                                    </v-col>
                                    <v-col class="d-flex" cols="12" sm="6" xsm="12">
                                    </v-col>
                                    <v-spacer></v-spacer>
                                    <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                                        <v-btn block :disabled="!valid" outlined color="blue-grey darken-2" @click="login">
                                            <v-icon
                                                dark
                                                left
                                                dense
                                            >
                                                mdi-account-arrow-left-outline
                                            </v-icon>{{$t('user.login')}} 
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card class="px-4">
                        <v-card-text>
                            <v-form ref="registerForm" v-model="valid" lazy-validation>
                                <v-row>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field v-model="firstName" :rules="[rules.required]" :label="$t('user.fname')" maxlength="20" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field v-model="lastName" :rules="[rules.required]" :label="$t('user.lname')" maxlength="20" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field v-model="email" :rules="emailRules" :label="$t('user.email')" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" :label="$t('user.password')" hint="At least 8 characters" counter @click:append="show1 = !show1"></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field block v-model="verify" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, passwordMatch]" :type="show1 ? 'text' : 'password'" name="input-10-1" :label="$t('user.confirmpw')" counter @click:append="show1 = !show1"></v-text-field>
                                    </v-col>
                                    <v-spacer></v-spacer>
                                    <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                                        <v-btn block :disabled="!valid" outlined color="blue-grey darken-2" @click="register">
                                            <v-icon
                                                dark
                                                left
                                                dense
                                            >
                                                mdi-account-check-outline
                                            </v-icon>{{$t('user.register')}}
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs>
        </div>
        <div v-else>
            <v-card class="mx-auto" tile>
                <div class="cyan accent-4 text-center" style="height:4rem">
                    <v-list-item color="rgba(0, 0, 0, .4)">
                        <v-list-item-content>
                            <v-list-item-title class="title" style="font-size: 1rem !important;">{{$store.state.user.firstname}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-avatar
                        color="brown"
                        size="50"
                        style="top: -0.5rem; "
                    >
                        <span class="white--text text-h5">{{$store.state.user.nameAbbreviation}}</span>
                    </v-avatar>
                </div>
                
                <v-list-item color="rgba(0, 0, 0, .4)" class="text-center" style="margin-top: 1.5rem; ">
                        <v-list-item-content>
                            <v-list-item-title class="title" style="font-size: 1rem !important;">{{$store.state.user.firstname}} {{$store.state.user.lastname}}</v-list-item-title>
                            <v-list-item-subtitle style="font-size: 0.8rem !important;">{{$store.state.user.email}}</v-list-item-subtitle>
                        </v-list-item-content>
                </v-list-item>
                <v-col >
                   
                    <v-expansion-panels accordion>
                    <v-expansion-panel 
                       
                    >
                        <v-expansion-panel-header @click="loadSavedResults">{{$t('user.savedresults')}}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <SavedResultsTable />
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
                <v-col>
                    <v-btn
                        class="ma-2"
                        color="blue-grey darken-2"
                        outlined
                        @click="logout"
                    >
                        <v-icon
                        dark
                        left
                        dense
                        >
                            mdi-account-arrow-right-outline
                        </v-icon>{{$t('user.logout')}}
                    </v-btn>
                </v-col>
                
            </v-card>
        </div>
    </div>
</v-scroll-x-transition>
</template>

<script>
import SavedResultsTable from "./SavedResultsTable.vue" 
import $i18n from "../plugins/i18n/i18n"
export default {
    name: "User",
    components: {
        SavedResultsTable
    },
    computed: {
    passwordMatch() {
      return () => this.password === this.verify || $i18n.t('user.pwmatch');
    },
  },
  
  methods: {
    validate() {
      if (this.$refs.loginForm.validate()) {
        // submit form to server/API here...
      }
    },
    register(){
        this.$store.dispatch("user/register", {firstName: this.firstName, lastName: this.lastName, email: this.email, password: this.password})
    },
    login(){
        this.$store.dispatch("user/login", {loginEmail: this.loginEmail, loginPassword: this.loginPassword})
    },
    logout(){
        this.$store.commit("user/logout")
        this.$store.dispatch("user/logoutAlert")
        this.$store.dispatch("user/clearSearchResult")
    },
    loadSavedResults(){
        this.$store.dispatch("user/loadSavedResults")
    }
    
  },
  data: () => ({
    dialog: true,
    tab: 0,
    tabs: [
        {name:$i18n.t('user.login'), icon:"mdi-account"},
        {name:$i18n.t('user.register'), icon:"mdi-account-outline"}
    ],
    valid: true,
    
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    verify: "",
    loginPassword: "",
    loginEmail: "",
    loginEmailRules: [
      v => !!v || $i18n.t('user.required'),
      v => /.+@.+\..+/.test(v) || $i18n.t('user.emailValid')
    ],
    emailRules: [
      v => !!v || $i18n.t('user.required'),
      v => /.+@.+\..+/.test(v) || $i18n.t('user.emailValid')
    ],

    show1: false,
    rules: {
      required: value => !!value || $i18n.t('user.required'),
      min: v => (v && v.length >= 8) || $i18n.t('user.minChar')
    }
  })
}
</script>

<style scoped>
    .user-ui{
        background-color: rgba(255, 255, 255, 1);
        width: 30vw;
        max-height: 100vh;
        overflow-y: scroll !important;
    }
    .user-ui::-webkit-scrollbar {
        display: none;
    }
    .signout:hover{
        background: rgb(192, 186, 186);
    }
</style>