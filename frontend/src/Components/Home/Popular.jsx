/* eslint-disable react/prop-types */


const Popular = () => {

    const cards = [
      {
        imageSrc:
          "https://relayfm.s3.amazonaws.com/uploads/person/avatar/5/user_avatar_caseyliss_artwork.png",
        name: "Casey Liss",
        description:
          "Casey Liss is an independent developer and writer by day. He is one third of the Accidental Tech Podcast by night. He has shared his experiences on development, technology through his podcasts and online presence.",
      },
      {
        imageSrc:
          "https://relayfm.s3.amazonaws.com/uploads/person/avatar/56/user_avatar_mykehurley_artwork.png",
        name: "Myke Hurley",
        description:
          "Myke has been podcasting since 2010. What started as a hobby. In 2014 he co-founded Relay FM, with Stephen Hackett. Myke now hosts a variety of podcasts with topics ranging from the latest in technology to creativity.",
      },
      {
        imageSrc:
          "https://m.media-amazon.com/images/S/amzn-author-media-prod/9ha5agkd7ujvkpgit59939ln4p._SY300_.jpg",
        name: "Dan Moren",
        description:
          "Dan Moren is a freelance technology writer, podcaster, and the author of the forthcoming supernatural detective novel. He's the East Coast Bureau Chief of Six Colors and the co-host of tech podcast.",
      },
      // Add more cards as needed
    ];
  return (
    <>
     
      <div className=" bg-gray-50 container mt-3 mx-auto py-5">
        <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-10 gap-5">
          {cards.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </div>
    </>
  );
}

const Card = ({ imageSrc, name, description }) => (
  <div className="bg-white rounded-lg shadow-xl max-w-sm m-auto transition-transform   transform hover:scale-105 hover:bg-blue-400 hover:text-white">
    <div className="h-32 mt-4 ">
      <img src={imageSrc} alt="Image" className="mx-auto h-full rounded-full" />
    </div>
    <div className="p-4">
      <h3 className="text-xl text-center font-semibold mb-2">{name}</h3>
      <p className="text-center text-sm">{description}</p>
    </div>
  </div>
);

export default Popular