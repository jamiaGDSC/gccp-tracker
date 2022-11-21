import fs from "fs";
import path from "path";
import Head from "next/head";
import Parser from "csv-parser";

export default function Home(props: any) {
  const { data, errors, meta } = props;

  return (
    <div className="">
      <Head>
        <title>GCCP 2022</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h1>GCCP 2022 Status</h1>
      </div>

      <table border={2} cellPadding={5}>
        <thead>
          <tr>
            <th>Sl. No.</th>
            <th>Student Name</th>
            <th>Student Email</th>
            <th># Courses Completed</th>
            <th>Completion Status</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item: any, index: number) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <a href={item["Google Cloud Skills Boost Profile URL"]}>
                  {item["Student Name"]}
                </a>
              </td>
              <td>{item["Student Email"]}</td>
              <td>{item["# of Courses Completed"]}</td>
              <td>{item["Learning Path Completion Status"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export async function getStaticProps() {
  const getData = async (location: string) => {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      fs.createReadStream(location)
        .pipe(Parser())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          console.log("CSV file successfully processed");
          resolve(results);
        })
        .on("error", (error) => {
          console.log("Error while processing CSV file");
          console.log(error);
          reject(error);
        });
    });
  };

  const fileName =
    process.env.NODE_ENV === "development" ? "sample.csv" : "last-updated.csv";

  const fileLocation = path.join(process.cwd(), `data/${fileName}`);
  const res = await getData(fileLocation);
  const data = (res as any).sort((a: any, b: any) => {
    const criteria = "# of Courses Completed";
    return a[criteria] < b[criteria] ? 1 : -1;
  });

  return {
    props: {
      data: data,
    },
  };
}
