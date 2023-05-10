<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useWhaleStore } from "@/stores/whale";
import { Toast } from 'vant';

/*const router = useRouter();

使用程式新增的方式執行串const videos = ref([
  {
    id: 1,
    name: 'Fantastic Seascape',
    image: 'FantasticSeascape.png',
    url: 'xxxxxx.mp4',
  },
  {
    id: 2,
    name: 'Waterfall: Samoa',
    image: 'FantasticSeascape.png',
    url: 'xxxxxx.mp4',
  },
  {
    id: 3,
    name: 'Galary',
    image: 'FantasticSeascape.png',
    url: 'xxxxxx.mp4',
  },
  /*{
    id: 4,
    name: 'Mountain Grassland',
    image: 'FantasticSeascape.png',
    url: 'xxxxxx.mp4',
  },
  {
    id: 5,
    name: 'Mountain Grassland',
    image: 'xxxxx.jpg',
    url: 'xxxxxx.mp4',
  }
]);*/


</script>
<template>
  <main class="full-page has-navbar">
    <!-- 置頂導覽列 -->
    <van-nav-bar
        title="投影片"
        fixed
    >
      <template #right>
        <img src="@/assets/images/Menu.png" style="width:40px" @click="router.push({name: 'menu'});"/>
      </template>
    </van-nav-bar>

    <!-- 頁面內容 -->
    <div class="padding-x">
      <div class="movie-area">
        
        
        <div class="movie-card">
          <img class="tryimg" src="@/assets/images/FantasticSeascape.jpg"/>
          <div class="movie-description">Fantastic Seascape</div>
        </div>

        <div class="movie-card">
          <img class="tryimg" src="@/assets/images/waterfall-samoa.jpg"/>
          <div class="movie-description">Samoa Falls</div>
        </div>

        <div class="movie-card">
          <img class="tryimg" src="@/assets/images/galaxy.jpg"/>
          <div class="movie-description">Galaxy</div>
        </div>

        <div class="movie-card">
          <img class="tryimg" src="@/assets/images/Mt. Grassland.jpg"/>
          <div class="movie-description">Mt. Grassland</div>
        </div>

        <!--<div
          v-for="v in videos"
          :key="v.id"
          class="movie-card"
        >
          使用程式新增的方式執行串 影片上傳區
          <div class="movie-thumbnail"></div>
          <img class="tryimg" src="@/assets/images/FantasticSeascape.png"/><!
          <div class="movie-description">{{ v.name }}</div>
        </div>-->
        
        <div class="Added_movie-card"><!-- 新增 -->
          <div class="Added_movie-thumbnail">
            <div class="arrow">
              <div class="line-1"></div>
              <div class="line-2"></div>
            </div>
          </div>
          <div class="Added_movie-description"></div>
        </div>

      </div>
    </div>
  </main>
</template>

<style>
.padding-x {
  margin-top: 10px;
}
.movie-area {/*影片區塊*/
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 20px;
    grid-column-gap: 20px;
    justify-content: space-between;
    padding: 40px 0;
}

.movie-card {/*影片縮圖+文字*/
  box-shadow: 5px 5px 8px rgb(1 2 0 / 10%);
  border-radius:20px;
}

.movie-thumbnail {/*影片縮圖*/
  height: 120px;
  background-color: #EEF6FF;
  /*影片上傳區background-image: url(src/assets/images/FantasticSeascape.png);*/
  background-size:cover;
  border-top-right-radius:20px;
  border-top-left-radius:20px;
}
.tryimg{/*之後刪掉*/
  width: 160px;
  height: 120px;
  border-top-right-radius:20px;
  border-top-left-radius:20px;
  margin: 0;
  padding: 0;
}

.movie-description {/*影片文字*/
  color: rgb(135 129 118);
  background-color: white;
  height: 30px;
  line-height: 30px;
  text-align: center;
  padding: 10px;
  font-size: 10pt;
  border-bottom-right-radius:20px;
  border-bottom-left-radius:20px;
}

.Added_movie-card {/*新增影片縮圖+文字*/
  box-shadow: 5px 5px 8px rgb(1 2 0 / 10%);
  border-radius:20px;
  background-color: #EEF6FF;
}

.Added_movie-thumbnail {/*新增影片縮圖*/
  height: 120px;
  background-color: #EEF6FF;
  border-top-right-radius:20px;
  border-top-left-radius:20px;
}

.Added_movie-description {/*新增影片文字*/
  color: rgb(183, 181, 177);
  background-color: #EEF6FF;
  height: 30px;
  line-height: 30px;
  text-align: center;
  padding: 10px;
  font-size: 10pt;
  border-bottom-right-radius:20px;
  border-bottom-left-radius:20px;
}

.img-rect-2 {
    width: 100%;
    height: 350px;
    background-size: cover;
    background-position: center;
}

.arrow { /* + */
    position: relative;
}
.line-1 {
    position: absolute;
    display: block;
    width: 35px;
    right: 60px;
    height: 5.5px;
    top: 80px;
    background-color:#C0D3ED;
    border-radius: 50px;
}
.line-2 {
    position: absolute;
    display: block;
    width: 35px;
    right: 60px;
    height: 5.5px;
    top: 80px;
    background-color: #C0D3ED;
    transform: rotate(90deg);
    border-radius: 50px;
}

</style>