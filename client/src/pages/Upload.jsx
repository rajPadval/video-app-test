const Upload = () => {
  const uploadData = async (e) => {
    e.preventDefault();
    console.log(e.target.file.files[0]);
    const formData = new FormData();
    formData.append("file", e.target.file.files[0]);
    formData.append("api_key", "175683389456343");
    formData.append("upload_preset", "video-app-test");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/diouxllrj/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    console.log(data);
  };
  return (
    <div>
      <h1>Upload</h1>
      <form onSubmit={uploadData} method="post" encType="multipart/form-data">
        <input type="file" name="file" accept="video/mp4,vi-deo/x-m4v,video/*" />
        <button
          type="submit"
          className="border px-3 py-2 rounded-lg bg-green-500"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default Upload;
