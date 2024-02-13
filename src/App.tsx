import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

const App = () => {
  const [file, setFile] = useState<string | undefined>(undefined);
  const [file2, setFile2] = useState<string | undefined>(undefined);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    // show the preview of the file
    const reader = new FileReader();
    reader.onload = () => {
      setFile(reader.result as string);
    }
    reader.readAsDataURL(e.target.files[0]);


  }

  const handleSubmit = () => {
    // serialize the file to base64
    // get rid of data:image/png;base64, to get the base64 string
    const base64 = file?.split(',')[1];
    const params = {
      user_id: 10,
      profile_photo_in_base64: base64
    }
    console.log("serialzed data", base64);
    const res = axios.post('http://localhost:3005/s3_upload_test', params);
  }

  const handleFetch = async () => {
    const params = {
      user_id: 10
    }
    const res = await axios.post('http://localhost:3005/s3_download_test', params);
    console.log(res);

    const base64 = res.data;
    // add data:image/png;base64, to the base64 string to show it as an image
    const base64_with_prefix = `data:image/png;base64,${base64}`;
    setFile2(base64_with_prefix);

  }


  return (
    <div className="App">
      <div>
        <input type="file" onChange={handleChange} />
        {/* img input only png, jpg, jpeg */}
        <h2>Selected Image</h2>
        <img src={file} alt="preview" />
      </div>
      {/* button to submit the file */}
      <div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
      {/* button to fetch the image from s3 and show it */}
      <div>
        <button onClick={handleFetch}>Fetch</button>
      </div>

      {/* img to show the fetched image */}
      <div>
        <h2>Fetched Image</h2>
        <img src={file2} alt="fetched_data" />
      </div>
    </div>
  );
}

export default App;
