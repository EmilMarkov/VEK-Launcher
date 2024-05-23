import axios from "axios";
import UserAgent from "user-agents";

import store from "@store";
import { fetchTorrentsRequest } from "@/store/actionCreators/torrents";

import { useDispatch, useSelector } from "react-redux";

export const saveTorrent = async () => {
  const dispatch = useDispatch()
  dispatch(fetchTorrentsRequest())
}

export const requestWebPage = async (url: string) => {
  const userAgent = new UserAgent();

  return axios
    .get(url, {
      headers: {
        "User-Agent": userAgent.toString(),
      },
    })
    .then((response) => response.data);
};

export const decodeNonUtf8Response = async (res: Response) => {
  const contentType = res.headers.get("content-type");
  if (!contentType) return res.text();

  const charset = contentType.substring(contentType.indexOf("charset=") + 8);

  const text = await res.arrayBuffer().then((ab) => {
    const dataView = new DataView(ab);
    const decoder = new TextDecoder(charset);

    return decoder.decode(dataView);
  });

  return text;
};

export const getFileBuffer = async (url: string) =>
  fetch(url, { method: "GET" }).then((response) =>
    response.arrayBuffer().then((buffer) => Buffer.from(buffer))
  );