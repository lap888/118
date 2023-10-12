export function encryptionUsername(name) {
    try {
        if (name) {
            let nameArray = name.split("");
            return `${nameArray.splice(0, 1)}**`;
        } else {
            return "***"
        }
    } catch (error) {
        console.log(error);
        return name
    }
}

export function encryptionMobile(mobile) {
    try {
        if (mobile) {
            let mobileArray = mobile.split("");
            mobileArray.splice(3, 4, "****");
            return mobileArray.join("");
        } else {
            return "***********";
        }
    } catch (error) {
        console.log(error);
        return "***********";
    }
}

export function encryptionIdCode(idcode) {
    try {
        if (idcode) {
            let idcodeArray = idcode.split("");
            idcodeArray.splice(7, 6, "******");
            return idcodeArray.join("");
        } else {
            return "***********";
        }
    } catch (error) {
        console.log(error);
        return idcode;
    }
}

export function encryptionAdress(idcode) {
    try {
        if (idcode) {
            let idcodeArray = idcode.split("");
            idcodeArray.splice(10, 6, "****");
            return idcodeArray.join("");
        } else {
            return "***********";
        }
    } catch (error) {
        console.log(error);
        return idcode;
    }
}