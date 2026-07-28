<template>
    <Navbar></Navbar>
    <router-view></router-view>
    <Toast /> 
  
</template>

<script>

import Navbar from './components/Navbar.vue';
import Toast from './components/Toast.vue';

export default{
  components:{
    Navbar,
    Toast
  }
}
</script>