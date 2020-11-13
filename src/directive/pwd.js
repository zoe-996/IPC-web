import Vue from "vue";

Vue.directive("pwd", {
  bind(el) {
    const target = el instanceof HTMLInputElement ? el : el.querySelector("input");
    target.onkeyup = () => {
        target.value = target.value.replace(/[^0-9a-zA-Z~!@&#%$^*()}{=+_;:?"',\][.|/\\-]/g, "");
    };
  } 
});