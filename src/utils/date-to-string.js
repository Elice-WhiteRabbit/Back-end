module.exports = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1, 두 자리로 맞추기
    const day = date.getDate().toString().padStart(2, '0'); // 두 자리로 맞추기
    const hours = date.getHours().toString().padStart(2, '0'); // 두 자리로 맞추기
    const minutes = date.getMinutes().toString().padStart(2, '0'); // 두 자리로 맞추기
    const seconds = date.getSeconds().toString().padStart(2, '0'); // 두 자리로 맞추기
  
    const formattedString = `${year}${month}${day}${hours}${minutes}${seconds}`;
    return formattedString;
}