import { Send } from "../../utils/Http";
import { Toast } from "../../view/common";
// import { Toast } from "native-base";
let CityApi = {};

CityApi.setContact = (params) => {
    return new Promise((resolve, reject) => {
        Send('api/city/SetContact', params)
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else{
                Toast.tipBottom(res.message)
                // Toast.show({
                //     text: `${res.message}`,
                //     position: "top",
                //     textStyle: { textAlign: "center" },
                //     duration: 2000,
                // })
            }
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}



export default CityApi;