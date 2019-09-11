<template>
  <div class="full">
    <div class="center">
      <div class="center-title">
        This is a center
      </div>
      <div class="lower-box">
        <div class="lower-text">
          This is some smaller text
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
  .full {
    background-color: black;
    width: 100%;
    height: 100%;
    color: white;
    font-size: 24pt;
  }
  .center {
    position: absolute;
    top: 10vh;
    left: 25vw;
    height: 80vh;
    width: 50vw;
    border: 1px solid white;
  }
  .center-title {
    margin-top: 20px;
  }
  .lower-text {
    text-align: center;
    font-size: 12pt;
  }
  .lower-box {
    margin-top: 50vh;
  }
</style>
