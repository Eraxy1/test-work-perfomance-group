<template>
  <div class="page">
    <div class="main-container">
      <div class="box-container">
        <div class="title-container">
          <h1 class="title-name">Список пользователей</h1>
        </div>
        <ul>
          <li
            class="user-name"
            v-for="user in paginatedUsers"
            :key="user.id"
            @click="goToUser(user.id)"
          >
            <nuxt-link :to="'/users/' + user.id">
              {{ user.name }} - {{ user.email }}
            </nuxt-link>
          </li>
        </ul>

        <div class="pagination-container">
          <span class="pagination-text"
            >Страница {{ currentPage }} из {{ totalPages }}</span
          >
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
      currentPage: 1,
      usersPerPage: 3,
    };
  },
  computed: {
    users: function () {
      return this.$store.state.users;
    },
    paginatedUsers: function () {
      const { currentPage, usersPerPage, users } = this;
      const start = (currentPage - 1) * usersPerPage;
      const end = start + usersPerPage;
      return users.slice(start, end);
    },
    totalPages: function () {
      const { users, usersPerPage } = this;
      return Math.ceil(users.length / usersPerPage);
    },
  },
  async asyncData({ store }) {
    try {
      await store.dispatch("getUsers");
    } catch (error) {
      console.error("Не удалось найти users:", error);
    }
  },
  methods: {
    goToUser: function (userId) {
      this.$router.push(`/users/${userId}`);
    },
    goToPage: function (page) {
      const { totalPages } = this;
      if (page >= 1 && page <= totalPages) {
        this.currentPage = page;
      }
    },
  },
};
</script>




