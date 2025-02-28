export const calculateEMI = (loanAmount, interestRate, tenure) => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / (12 * 100); 
    const months = parseInt(tenure, 10); 
  
    const emi = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    return emi;
  };
  