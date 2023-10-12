


const loginform = document.getElementById('login-form');
const code = document.getElementById('code');
let mobileNumber;
let isOtp = false;
let isThere = false;
let done = false;
loginform.addEventListener("submit", async (e) => {
    e.preventDefault();
    mobileNumber = parseInt(document.getElementById("number").value);
    
    if(isNaN(mobileNumber)){
        alert('Invalid Phone Number')
    }
    else{
        //process
        if(isOtp){
            const otpCode = code.value;
            await verifyOTP(mobileNumber,otpCode)
            return;
        }
        
        let SHEET_ID = '1NZqlefPXjbmg5BsKtyLLhHM_uJ7YKPWHP-1rsUY_Pmk'
        let SHEET_TITLE = 'number';
        let SHEET_RANGE = 'B:B';
        
        let FULL_URL = ('https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?sheet=' + SHEET_TITLE + '&range=' + SHEET_RANGE);
        
        const getdata = await fetch(FULL_URL)
        .then(res => res.text())
        .then(rep => {
            let data = JSON.parse(rep.substr(47).slice(0,-2));
            for(let i=0; i< data.table.rows.length;i++){
            if(data.table.rows[i].c[0].f == mobileNumber || data.table.rows[i].c[0].v == mobileNumber){
              alert('You already got your sample!!!')
              isThere=true;
              
              break
            }
          }
        })

        if(isThere == false){
        const data = new FormData(loginform);

          try {
            const res = await fetch(
              'https://script.google.com/macros/s/AKfycbwoOIzAI66bm-SW-E8zY-J5Vqc_FWKisSNoSHDSc_Wri_UCgDMfq1z6QJ9HQp_gG-gL/exec',
              {
                method: 'POST',
                body: data,
              },
            );

        const resData = await res.json();

          console.log(resData);
        } catch (err) {
          console.log(err.message);
        }
        await sendData(mobileNumber)
      }
    
  }
 
})
  
  
  
function reload(){
  location.reload();
}
  
  
  
  async function sendData(mobileNumber){    

       fetch('https://opt-api.netlify.app/.netlify/functions/index/send-verification-otp', {
        method: 'POST',
        body: JSON.stringify({
            "mobileNumber":mobileNumber

  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept',
    
  }
  })
  .then(function(response){ 
  return response.json()})
  .then(function(data)
  {
    console.log(data)
    if(data.verification.status === 'pending'){
        code.classList.remove('hidden');
        isOtp = true;
        document.getElementById('btn').innerText = "CLAIM GIFT"
    }
})
  .catch(error => console.error('Error:', error)); 
  }

  async function verifyOTP(mobileNumber,otpCode){

    

       fetch('https://opt-api.netlify.app/.netlify/functions/index/verify-otp', {
  method: 'POST',
  body: JSON.stringify({
    "mobileNumber":mobileNumber,
    "otpCode":otpCode

  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept',
    
  }
  })
  .then(function(response){ 
  return response.json()})
  .then(function(data)
  {console.log(data)
    if(data.verification_check.status === "approved"){
      
        document.getElementById('rem').classList.add('hidden');
        document.getElementById('trem').classList.add('hidden');
        document.getElementById('drem').classList.add('hidden');
        document.getElementById('code').classList.add('hidden');
        document.getElementById('btn').classList.add('hidden');
        document.getElementById('after').classList.remove('hidden');
        document.getElementById('after-btn').classList.remove('hidden');
    }
    else if(responce.status != 'approved'){
        alert('Invalid OTP')
    }
    return data
}).catch(error => console.error('Error:', error)); 
  }