import en from './en'

export const t = key => {
    const val = en[key]
    if (!val) {
        return "";
    } else {
        return val;
    }

}