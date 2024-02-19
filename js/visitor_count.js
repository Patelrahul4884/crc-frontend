
async function get_visitors() {
    // call post api request function
    //await post_visitor();
    try {
      let response = await fetch('https://4ix1ubxo38.execute-api.us-east-1.amazonaws.com/prod/countVisitor', {
        method: 'GET',
      });
      let data = await response.json()
      document.getElementById("visitors").innerHTML = data['visitor_count'];
      console.log(data);
      return data;
    } catch (err) {
      console.error(err);
    }
  }
get_visitors();