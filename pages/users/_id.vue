<template>
  <div class="page">
    <div class="main-container">
      <div class="back-btn">
        <nuxt-link class="" to="/"> Вернуться на главную </nuxt-link>
        <div class="btn-switch-container">
          <button class="btn-switch" @click="prevUser">
            <span class="material-symbols-outlined"> arrow_back </span>
          </button>
          <button class="btn-switch" @click="nextUser">
            <span class="material-symbols-outlined"> arrow_forward </span>
          </button>
        </div>
      </div>

      <div class="box-container">
        <h1 class="user-title-name">{{ selectedUser.name }}</h1>

        <div class="first-container">
          <v-row class="information-container">
            <v-col cols="" class="information-text">
              <p class="title-text">Персональные данные</p>
              <p>
                Имя пользователя: <span>{{ selectedUser.username }}</span>
              </p>
              <p>
                Телефон: <span>{{ selectedUser.phone }}</span>
              </p>
              <p>
                Веб-сайт: <span>{{ selectedUser.website }}</span>
              </p>
              <p>
                Email: <span>{{ selectedUser.email }}</span>
              </p>
            </v-col>
            <div :class="{ 'horizontal-line': mobileLine }"></div>
            <v-col cols="" class="information-text">
              <p class="title-text">Место проживания</p>
              <p>
                Город: <span>{{ selectedUser.address.city }}</span>
              </p>
              <p>Улица: {{ selectedUser.address.street }}<span></span></p>
              <p>
                Дом: <span>{{ selectedUser.address.suite }}</span>
              </p>
              <p>
                Почтовый индекс: <span>{{ selectedUser.address.zipcode }}</span>
              </p>
            </v-col>
          </v-row>
        </div>
        <div class="horizontal-line"></div>
        <p class="title-text">Место работы</p>
        <div class="information-text">
          <p>
            Имя компании: <span>{{ selectedUser.company.name }}</span>
          </p>
          <p>
            Баланс компании: <span>{{ selectedUser.company.bs }}</span>
          </p>
          <p>
            Слоган: <span>{{ selectedUser.company.catchPhrase }}</span>
          </p>
        </div>
        <div class="horizontal-line"></div>
        <button class="get-posts" @click="getPosts">
          {{ postsVisible ? "Закрыть" : "Получить посты" }}
        </button>
        <transition name="fade" mode="out-in">
          <ul v-if="postsVisible && userPosts.length" key="posts">
            <li v-for="post in visibleUserPosts" :key="post.id">
              <h3>{{ post.title }}</h3>
              <p>{{ post.body }}</p>
            </li>
          </ul>
        </transition>
        <div v-if="postsVisible" class="pagination-container">
          <span class="pagination-text">
            Страница {{ currentPage }} из {{ totalPages }}
          </span>
          <div class="pagination-btns">
            <button
              class="btn-style"
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              v-show="currentPage !== 1"
            >
              <span class="material-symbols-outlined"> arrow_back </span>
            </button>
            <button
              class="btn-style"
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              v-show="currentPage !== totalPages"
            >
              <span class="material-symbols-outlined"> arrow_forward </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      mobileLine: false,
      currentPage: 1,
      postsPerPage: 3,
      postsVisible: false,
      postsRequestSent: false,
    };
  },
  computed: {
    selectedUser() {
      return this.$store.state.selectedUser;
    },
    userPosts() {
      return this.$store.state.userPosts;
    },
    visibleUserPosts() {
      const start = (this.currentPage - 1) * this.postsPerPage;
      const end = start + this.postsPerPage;
      return this.userPosts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.userPosts.length / this.postsPerPage);
    },
  },
  methods: {
    async prevUser() {
      const { users, selectedUser } = this.$store.state;
      const currentIndex = users.findIndex(
        (user) => user.id === selectedUser.id
      );
      if (currentIndex > 0) {
        const prevUser = users[currentIndex - 1];
        await this.$store.dispatch("getSelectedUsers", prevUser.id);
        await this.$store.dispatch("getUserPosts");
        this.goToPage(1);
      }
    },

    async nextUser() {
      const { users, selectedUser } = this.$store.state;
      const currentIndex = users.findIndex(
        (user) => user.id === selectedUser.id
      );
      if (currentIndex < users.length - 1) {
        const nextUser = users[currentIndex + 1];
        await this.$store.dispatch("getSelectedUsers", nextUser.id);
        await this.$store.dispatch("getUserPosts");
        this.goToPage(1);
      }
    },
    goToPage: function (page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    async getPosts() {
      if (this.postsVisible) {
        this.postsVisible = false;
      } else {
        if (!this.postsRequestSent) {
          await this.$store.dispatch("getUserPosts", this.$route.params.id);
          this.postsRequestSent = true;
        }
        this.postsVisible = true;
      }
    },
    checkScreenWidth() {
      this.mobileLine = window.innerWidth <= 583;
    },
  },
  async asyncData({ params, store }) {
    await store.dispatch("getSelectedUsers", params.id);
  },
  mounted() {
    this.checkScreenWidth();

    window.addEventListener("resize", this.checkScreenWidth);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkScreenWidth);
  },
};
</script>
