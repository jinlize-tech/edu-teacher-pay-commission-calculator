const fs = require('fs');
const input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const errors = [];
function field(key, max = Number.MAX_SAFE_INTEGER) {
  const value = Number(input[key]);
  if (input[key] === undefined || input[key] === null || input[key] === '' || !Number.isFinite(value) || value < 0 || value > max) {
    errors.push(`${key}必须在0到${max}之间`);
    return null;
  }
  return value;
}
const baseSalary = field('baseSalary');
const deliveredHours = field('deliveredHours');
const hourlyRate = field('hourlyRate');
const sales = field('sales');
const commissionRate = field('commissionRate', 1);
const bonus = field('bonus');
const deductions = field('deductions');
if (errors.length) {
  console.log(JSON.stringify({status:'invalid',formula_version:'1.0.2',errors}, null, 2));
  process.exit(2);
}
const hourPay = Number((deliveredHours * hourlyRate).toFixed(2));
const commission = Number((sales * commissionRate).toFixed(2));
const grossPay = Number((baseSalary + hourPay + commission + bonus).toFixed(2));
const netPay = Number((grossPay - deductions).toFixed(2));
if (netPay < 0) {
  console.log(JSON.stringify({status:'invalid',formula_version:'1.0.2',errors:['扣减金额不得大于应发金额'],grossPay,netPay}, null, 2));
  process.exit(2);
}
console.log(JSON.stringify({status:'ok',formula_version:'1.0.2',hourPay,commission,grossPay,netPay,requiresPayrollReview:true}, null, 2));
