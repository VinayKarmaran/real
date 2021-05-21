<template>

  <div><span>{{message.sender}}:</span>{{message.content}}<span class="time">{{message.time}}</span></div>
</template>

<script>
export default {
   props: {
    // Basic type check (`null` and `undefined` values will pass any type validation)
    message: Object,},
  data() {
    return {
      range: 0,
    };
  },
  methods: {
    addForm: function() {
      this.range += 1;
    },
  },
};
</script>

<style>
.time{
  float: right;
}
</style>
