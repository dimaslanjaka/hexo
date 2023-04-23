declare global {
  namespace NodeJS {
      interface Global {
          hexo: import('.')
      }
  }
}
export default global;
