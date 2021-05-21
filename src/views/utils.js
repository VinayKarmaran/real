export async function getJsonData(url,queryParams){
    if (undefined !== queryParams && null !== queryParams) {
      url += this.encodeQueryString(queryParams);
    }
      let response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            //mode: "no-cors",
          },
          // credentials : "include"
        });
        return await response.json();
  }
  
  export async function postJsonData(url,payLoad){
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // mode: "no-cors",
      },
      body: JSON.stringify(payLoad),
      // credentials : "include"
    });
    let responseData = await response.json();
    return responseData;
  }