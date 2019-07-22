<template>
<div>
    <el-table
          :data="data"
          style="width: 100%">
          <el-table-column type="expand"></el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="attr_name" label="名称" width="180"></el-table-column>
          <el-table-column >
              <slot :row="data"></slot>
          </el-table-column>
      </el-table>
</div>

</template>
<script>
export default {
  data: () => ({

  }),
  props: ['data'],
  created () {
  },
  methods: {
  }
}
</script>
<style >
</style>