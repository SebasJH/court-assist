<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :class="[
              'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
              column.class || ''
            ]"
          >
            <div class="flex items-center gap-2">
              {{ column.label }}
              <SortButton
                v-if="column.sortable"
                :active="sortBy === column.key"
                :direction="sortDir"
                @click="$emit('sort', column.key)"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="(item, index) in items"
          :key="item.id || index"
          :class="[
            'hover:bg-gray-50 transition-colors duration-150',
            rowClass ? rowClass(item, index) : ''
          ]"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            :class="[
              'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
              column.class || ''
            ]"
          >
            <slot :name="column.key" :item="item" :column="column" :index="index">
              {{ getValue(item, column.key) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="items.length === 0" class="text-center py-8 text-gray-500">
      <slot name="empty">
        Geen gegevens gevonden
      </slot>
    </div>
  </div>
</template>

<script>
import SortButton from '../SortButton.vue'

export default {
  name: 'DataTable',
  components: { SortButton },
  props: {
    columns: {
      type: Array,
      required: true,
      // Each column should have: { key, label, sortable?, class? }
    },
    items: {
      type: Array,
      required: true
    },
    sortBy: {
      type: String,
      default: ''
    },
    sortDir: {
      type: String,
      default: 'asc',
      validator: (value) => ['asc', 'desc'].includes(value)
    },
    rowClass: {
      type: Function,
      default: null
    }
  },
  emits: ['sort'],
  methods: {
    getValue(item, key) {
      return key.split('.').reduce((obj, k) => obj?.[k], item) || ''
    }
  }
}
</script>
