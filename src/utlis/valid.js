class Valid {
    constructor() {
      //手机号验证
      this.phone={
          reg:/^1[345789]\d{9}$/,
          msg:'请填写正确的手机号'
      }
      //昵称验证
      //4到10位（字母，数字，汉字都可以）
      this.nickName={
          reg:/^[a-zA-Z0-9\u4e00-\u9fa5]{1,6}$/,
          msg:'昵称必须是1-6位的字母、数字、汉字或组合'
      }
  
      //密码验证
      //密码强度正则
      this.password={
          reg: /^[a-zA-Z][^\u4e00-\u9fa5]{5,15}$/,
          msg:'首个字符是字母，除了汉字的其他字符'
      }

      //旧密码密码验证
      this.oldPassword={
        reg: /^[a-zA-Z][^\u4e00-\u9fa5]{5,15}$/,
        msg:'旧密码首个字符是字母，除了汉字的其他字符'
    },
    //邮箱正则表达式
    this.email = {
        reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        msg: '邮箱格式不正确'
      }
    }
  
    validForm(o,k){
  
      for(let key in o){
          if(!this[key].reg.test(o[key])){
              k.$toast(this[key].msg);

              //表单不通过
              return false;
          }
      }
      //表单通过
      return true;
    }
  }
  
  export const valid = new Valid();
  