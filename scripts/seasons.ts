const season = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();


    if(month === 2 && (day >= 5 && day <= 16)) {
        return "romance_pack"
    }

    /**
    * Calculates Easter in the Gregorian/Western calendar 
    * based on the algorithm by Oudin (1940) from http://www.tondering.dk/claus/cal/easter.php
    * @returns {array} [int month, int day]
    */
    function getEaster(year: number) {
        let f = Math.floor,
            // Golden Number - 1
            G = year % 19,
            C = f(year / 100),
            // related to Epact
            H = (C - f(C / 4) - f((8 * C + 13)/25) + 19 * G + 15) % 30,
            // number of days from 21 March to the Paschal full moon
            I = H - f(H/28) * (1 - f(29/(H + 1)) * f((21-G)/11)),
            // weekday for the Paschal full moon
            J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
            // number of days from 21 March to the Sunday on or before the Paschal full moon
            L = I - J,
            month = 3 + f((L + 40)/44),
            day = L + 28 - 31 * f(month / 4);

        return [month,day];
    }

    if (month === getEaster(year)[0] && (day >= getEaster(year)[1] - 7 && day <= getEaster(year)[1] + 3)) {
        return "easter_pack"
    }

    if(month === 7 && (day >= 1 && day <= 6)) {
        return "independence_pack"
    }

    function thanksgiving(year: number) {
        const lastOfNov = new Date(year, 10, 30).getDay();
        const turkyDay = (lastOfNov >= 4 ? 34 : 27) - lastOfNov;
        return turkyDay
    }

    if(month === 10 && (day >= thanksgiving(year) - 7 && day <= thanksgiving(year) + 3)) {
        return "thanksgiving_pack"
    }

    if(month === 12 && (day >= 20 && day <= 31)) {
        return "christmas_pack"
    }

    return "";
}

export { season };