
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1;
let yyyy = today.getFullYear();
const data = document.querySelector('.data');
const audio = document.querySelector('audio');


const buildList = (centers, i) => {
    const div = document.createElement('div');
    const h3 = document.createElement('h3');
    const h4 = document.createElement('h4');
    const p = document.createElement('p');
    const h5 = document.createElement('h5');

    div.className = 'box';
    h3.append(centers[i].name);
    h4.append("Availability: ", centers[i].sessions[0].available_capacity_dose1);
    p.append('Date: ', centers[i].sessions[0].date);
    h5.append(centers[i].sessions[0].vaccine)
    const button = document.createElement('button');
    button.innerHTML = "<a href=https://selfregistration.cowin.gov.in/>Book Your Slot !!</a>"
    div.append(h3, h4, h5, p, button);
    data.append(div);

}

const list = async () => {
    let flag = false;
    var box = document.querySelectorAll('.box');
    if (typeof (box[0]) !== 'undefined' && box !== null) {
        for (let j = 0; j < box.length; j++) {
            box[j].remove();
        }
    }
    try {
        const cowinListToday = await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=305&date=${dd}-${mm}-${yyyy}`);
        const cowinListTomorrow = await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=305&date=${dd + 1}-${mm}-${yyyy}`);
        let centersToday = cowinListToday.data.centers;
        let centersTmr = cowinListTomorrow.data.centers;
        let centers = centersToday.concat(centersTmr);
        for (let i = 0; i < centers.length; i++) {
            if (centers[i].sessions[0].available_capacity_dose1 !== 0) {
                buildList(centers, i)
                flag = true;
            }
        }
        if (flag === false) {
            const div = document.createElement('div');
            const h2 = document.createElement('h2');
            div.className = 'box';
            h2.append("No slots available");
            div.append(h2);
            data.append(div);
        }
        else {
            audio.play();
        }
    }
    catch (e) {
        console.log(e);
    }
}
list();
setInterval(list, 5000);