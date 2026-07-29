
// Year
var __yr=document.getElementById('yr'); if(__yr) __yr.textContent=new Date().getFullYear();

// Header scroll state
var hdr=document.getElementById('hdr');
if(hdr){addEventListener('scroll',function(){hdr.classList.toggle('scrolled',scrollY>20)});}

// Mobile menu
var burger=document.getElementById('burger'),navLinks=document.getElementById('navLinks');
if(burger&&navLinks){burger.addEventListener('click',function(){navLinks.classList.toggle('open')});navLinks.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){navLinks.classList.remove('open')})});}

// Reveal on scroll
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(function(item){
  var q=item.querySelector('.faq-q'),a=item.querySelector('.faq-a');
  q.addEventListener('click',function(){
    var open=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(function(i){i.classList.remove('open');i.querySelector('.faq-a').style.maxHeight=null});
    if(!open){item.classList.add('open');a.style.maxHeight=a.scrollHeight+'px'}
  });
});

// ===== Mortgage calculator =====
var price=document.getElementById('price'),down=document.getElementById('down'),
    rate=document.getElementById('rate'),years=document.getElementById('years');
var priceVal=document.getElementById('priceVal'),downVal=document.getElementById('downVal'),
    rateVal=document.getElementById('rateVal'),yearsVal=document.getElementById('yearsVal'),
    monthly=document.getElementById('monthly'),loanNote=document.getElementById('loanNote');

function fmt(n){return 'AED '+Math.round(n).toLocaleString('en-US')}
function calc(){
  var p=+price.value, dpc=+down.value, r=+rate.value, y=+years.value;
  var dpAmount=p*dpc/100;
  var loan=p-dpAmount;
  var mr=r/100/12, n=y*12;
  var m = mr===0 ? loan/n : loan*mr*Math.pow(1+mr,n)/(Math.pow(1+mr,n)-1);
  priceVal.textContent=fmt(p);
  downVal.textContent=dpc+'% · '+fmt(dpAmount);
  rateVal.textContent=r.toFixed(2)+'%';
  yearsVal.textContent=y+' years';
  monthly.textContent=fmt(m);
  loanNote.textContent='Loan amount '+fmt(loan)+' over '+y+' years';
}
[price,down,rate,years].forEach(function(el){el.addEventListener('input',calc)});
calc();

// ===== Lead form =====
document.getElementById('leadForm').addEventListener('submit',function(e){
  e.preventDefault();
  var form=this;
  var msg=document.getElementById('formMsg');
  var name=document.getElementById('lname').value.trim();
  var cc=document.getElementById('lcc').value;
  var phone=document.getElementById('lphone').value.replace(/\D/g,'');
  var email=document.getElementById('lemail').value.trim();
  var service=document.getElementById('lservice').value;
  if(!name||!phone||phone.length<7||!email||!service){
    msg.textContent='Please complete all fields with a valid mobile and email.';
    msg.style.color='#b00020';msg.style.display='block';return;
  }
  var btn=form.querySelector('button[type=submit]');
  btn.disabled=true;btn.textContent='Sending…';

  var now=new Date();
  var pad=function(n){return (n<10?'0':'')+n;};
  var dateStr=pad(now.getDate())+'-'+pad(now.getMonth()+1)+'-'+now.getFullYear();
  var timeStr=pad(now.getHours())+':'+pad(now.getMinutes())+':'+pad(now.getSeconds());

  var payload={
    name: name,
    countryCode: cc,
    mobile: phone,
    email: email,
    project: 'ProCapital',
    notes: 'Mortgage enquiry — service requested: '+service,
    source: 'Website',
    subSource: 'ProCapital.ae — callback form',
    submittedDate: dateStr,
    submittedTime: timeStr,
    additionalProperties: { Service: service, PageUrl: location.href }
  };

  var done=false;
  var showOk=function(res){
    if(done) return; done=true;
    if(res && res.ok){
      msg.textContent='✓ Thank you! A ProCapital advisor will call you shortly.';
      msg.style.color='#137333';
      form.reset();
    } else {
      msg.textContent='Received — our team will contact you shortly.';
      msg.style.color='#b06000';
    }
    msg.style.display='block';
    btn.disabled=false;btn.textContent='Get my free callback';
  };
  // safety fallback in case the network is slow
  setTimeout(function(){ showOk({ok:true}); }, 4000);

  fetch('/api/leadrat',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload),
    keepalive:true
  })
  .then(function(r){ return r.json(); })
  .then(showOk)
  .catch(function(){ showOk({ok:false}); });
});
