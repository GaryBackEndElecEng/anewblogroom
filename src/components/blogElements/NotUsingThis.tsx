"use client"
import React from 'react';
import Button from "@/components/comp/Button";
import { msgType, paramsType } from '@lib/Types';
import { v4 as uuidv4 } from 'uuid';

export default function MainAdmin() {
  const [data, setData] = React.useState<paramsType>({} as paramsType);
  const [msg, setMsg] = React.useState<msgType>({ loaded: false, msg: "" });


  const insertID = React.useCallback((filename: string | undefined) => {
    function set_data() {
      const uuid = uuidv4().split("-")[0];//shortening string
      return setData({ ...data, id: `${uuid}-${filename}` });
    }

    if (filename) {
      set_data();
    }


  }, []);




  return (
    <div className="mx-auto container text-white w-full">
      {msg.loaded ? (
        <h3 className="text-center text-blue-800">{msg.msg}</h3>
      ) : (<h3 className="text-center text-red-800">{msg.msg}</h3>)}
      <form
        className="flex flex-col items-center justify-evenly w-3/4"
      >
        <fieldset className="m-auto flex flex-col items-center justify-evenly gap-3 bg-slate-400 ">
          <legend> Legend</legend>
          <div className="mx-auto flex flex-row gap-2">
            <label htmlFor="title">title</label>
            <input
              id="title"
              required
              name="title"
              aria-label="title"
              className="text-black"
              type="text"
              value={data.name ? data.name : ""}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>
          <div className="mx-auto flex flex-row gap-2">
            <label htmlFor="filename">Filename</label>
            <input
              id="filename"
              required
              name="filename"
              aria-label="filename"
              className="text-black"
              type="text"
              value={data.filename ? data.filename : ""}
              onChange={(e) => setData({ ...data, filename: e.target.value })}
            />
          </div>
          <div className="mx-auto flex flex-row gap-2">
            <label htmlFor="heading">Heading</label>
            <input
              id="targetID"
              name="heading"
              aria-label="section"
              className="text-black"
              type="text"
              value={data.heading ? data.heading : ""}
              onChange={(e) => setData({ ...data, heading: e.target.value })}
            />
          </div>
          <label htmlFor="summary"></label>
          <textarea
            cols={100}
            rows={5}
            id="targetID"
            name="summary"
            value={data.summary ? data.summary : ""}
            onChange={(e) => setData({ ...data, summary: e.target.value })}
            aria-label="summary"
            className="text-black"
          />
          <div className="mx-auto flex flex-row gap-2">
            <label htmlFor="subHeading">sub heading</label>
            <input
              id="targetID"
              name="subHeading"
              type="text"
              aria-label="subHeading"
              className="text-black"
              value={data.subheading ? data.subheading : ""}
              onChange={(e) => setData({ ...data, subheading: e.target.value })}
            />
          </div>
          <label htmlFor="section"></label>
          <textarea
            cols={100}
            rows={10}
            id="targetID"
            name="section"
            value={data.section ? data.section : ""}
            onChange={(e) => setData({ ...data, section: e.target.value })}
            aria-label="section"
            className="text-black"
          />
          <div className="mx-auto flex flex-row gap-2">
            <label htmlFor="heading2">second Heading</label>
            <input
              id="targetID"
              name="heading2"
              type="text"
              value={data.heading2 ? data.heading2 : ""}
              onChange={(e) => setData({ ...data, heading2: e.target.value })}
              aria-label="heading two"
              className="text-black"
            />
          </div>
          <label htmlFor="summary2"></label>
          <textarea
            cols={100}
            rows={5}
            id="targetID"
            name="summary2"
            value={data.summary2 ? data.summary2 : ""}
            onChange={(e) => setData({ ...data, summary2: e.target.value })}
            aria-label="summary2"
            className="text-black"
          />
          <div className="mx-auto flex flex-row gap-2">
            <label htmlFor="subheading2">sub heading two</label>
            <input
              id="targetID"
              name="subheading2"
              type="text"
              value={data.subheading2 ? data.subheading2 : ""}
              onChange={(e) => setData({ ...data, subheading2: e.target.value })}
              aria-label="subheading two"
              className="text-black"

            />
          </div>
          <label htmlFor="section2">section 2</label>
          <textarea
            cols={100}
            rows={10}
            id="targetID"
            name="section2"
            value={data.section2 ? data.section2 : ""}
            aria-label="section second"
            className="text-black"
            onChange={(e) => setData({ ...data, section2: e.target.value })}
          />
          <input
            type="date"
            id="date"
            name="date"
            required
            value={data.date ? data.date : ""}
            onChange={(e) => setData({ ...data, date: e.target.value })}
            className="text-black"
          />

          <button type={"submit"}
            className="rounded-full px-3 py-1 text-center text-white bg-blue-600 border border-zinc-300 shadow-md shadow-slate-500"
          >submit</button>
        </fieldset>
      </form>
    </div>
  )
}
