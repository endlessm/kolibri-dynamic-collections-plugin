const BYTES_PER_MB = 1000 * 1000;

export default {
  methods: {
    bytesToMB(bytes) {
      return Math.ceil(bytes / BYTES_PER_MB);
    },
  },
};
