
// Year
document.getElementById('yr').textContent=new Date().getFullYear();

// Header scroll state
var hdr=document.getElementById('hdr');
addEventListener('scroll',function(){hdr.classList.toggle('scrolled',scrollY>20)});

// Mobile menu
var burger=document.getElementById('burger'),navLinks=document.getElementById('navLinks');
burger.addEventListener('click',function(){navLinks.classList.toggle('open')});
navLinks.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){navLinks.classList.remove('open')})});

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
var priceInput=document.getElementById('priceInput'),downInput=document.getElementById('downInput'),
    rateInput=document.getElementById('rateInput'),yearsInput=document.getElementById('yearsInput'),
    downAmountEl=document.getElementById('downAmount'),
    monthly=document.getElementById('monthly'),loanNote=document.getElementById('loanNote');

// Exact property price can be any positive amount (not limited to slider min/max/step)
var priceExact=+price.value;

function fmt(n){return 'AED '+Math.round(n).toLocaleString('en-US')}
function fmtNum(n){return Math.round(n).toLocaleString('en-US')}
function parseNum(str){
  if(str==null)return NaN;
  var cleaned=String(str).replace(/[^\d.]/g,'');
  if(!cleaned)return NaN;
  return parseFloat(cleaned);
}
function clamp(n,min,max){return Math.min(max,Math.max(min,n))}
function snap(n,step){
  if(!step||step<=0)return n;
  return Math.round(n/step)*step;
}
function syncPriceSlider(n){
  var min=+price.min, max=+price.max;
  price.value=String(clamp(n,min,max));
}

function calc(fromSlider){
  var p=priceExact, dpc=+down.value, r=+rate.value, y=+years.value;
  var dpAmount=p*dpc/100;
  var loan=p-dpAmount;
  var mr=r/100/12, n=y*12;
  var m = mr===0 ? loan/n : loan*mr*Math.pow(1+mr,n)/(Math.pow(1+mr,n)-1);
  if(fromSlider!==false){
    if(document.activeElement!==priceInput) priceInput.value=fmtNum(p);
    if(document.activeElement!==downInput) downInput.value=String(dpc);
    if(document.activeElement!==rateInput) rateInput.value=Number(r).toFixed(2);
    if(document.activeElement!==yearsInput) yearsInput.value=String(y);
  }
  downAmountEl.textContent=fmt(dpAmount);
  monthly.textContent=fmt(m);
  loanNote.textContent='Loan amount '+fmt(loan)+' over '+y+' years';
}

function applyTyped(input,slider,opts){
  var raw=parseNum(input.value);
  if(isNaN(raw))return;
  var min=+slider.min, max=+slider.max, step=+slider.step||1;
  var next=clamp(snap(raw,step),min,max);
  // Allow intermediate typing; only snap/clamp hard on blur
  if(opts&&opts.commit){
    slider.value=String(next);
    if(opts.format==='money') input.value=fmtNum(next);
    else if(opts.format==='rate') input.value=Number(next).toFixed(2);
    else input.value=String(next);
    calc(true);
  }else if(raw>=min&&raw<=max){
    slider.value=String(clamp(raw,min,max));
    calc(false);
  }
}

function applyTypedPrice(opts){
  var raw=parseNum(priceInput.value);
  if(isNaN(raw))return;
  // Any whole-AED amount >= 1 — no slider min/max/step clamp
  var next=Math.max(1, Math.round(raw));
  priceExact=next;
  syncPriceSlider(next);
  if(opts&&opts.commit){
    priceInput.value=fmtNum(next);
    calc(true);
  }else{
    calc(false);
  }
}

price.addEventListener('input',function(){
  priceExact=+price.value;
  calc(true);
});
[down,rate,years].forEach(function(el){
  el.addEventListener('input',function(){calc(true)});
});

priceInput.addEventListener('input',function(){applyTypedPrice({})});
priceInput.addEventListener('change',function(){applyTypedPrice({commit:true})});
priceInput.addEventListener('blur',function(){applyTypedPrice({commit:true})});

downInput.addEventListener('input',function(){applyTyped(downInput,down,{})});
downInput.addEventListener('change',function(){applyTyped(downInput,down,{commit:true})});
downInput.addEventListener('blur',function(){applyTyped(downInput,down,{commit:true})});

rateInput.addEventListener('input',function(){applyTyped(rateInput,rate,{format:'rate'})});
rateInput.addEventListener('change',function(){applyTyped(rateInput,rate,{format:'rate',commit:true})});
rateInput.addEventListener('blur',function(){applyTyped(rateInput,rate,{format:'rate',commit:true})});

yearsInput.addEventListener('input',function(){applyTyped(yearsInput,years,{})});
yearsInput.addEventListener('change',function(){applyTyped(yearsInput,years,{commit:true})});
yearsInput.addEventListener('blur',function(){applyTyped(yearsInput,years,{commit:true})});

;[priceInput,downInput,rateInput,yearsInput].forEach(function(el){
  el.addEventListener('keydown',function(e){
    if(e.key==='Enter'){e.preventDefault();el.blur()}
  });
});

calc(true);

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
