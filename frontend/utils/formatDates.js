export function getTodayDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Mês começa do 0
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

export function formatDate(dataISO) {
  const data = new Date(dataISO);
  
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", 
                 "jul", "ago", "set", "out", "nov", "dez"];
  
  const dia = data.getDate();
  const mes = meses[data.getMonth()];

  return `${dia} ${mes}`;
}
