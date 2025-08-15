import { DateFormat } from "@/utils/FormatDate";
import Image from "next/image";
import React from "react";

export default function RoomList({ roomResponses }) {
  if (!roomResponses || roomResponses.length === 0)
    return <p>No rooms available</p>;

  return (
    <div className="space-y-6">
      {roomResponses.map((room, index) => {
        const price =
          room.rateKeyResponses?.rateKeys?.[0]?.cancellationPolicy?.[0]?.amount;
        const policyFrom =
          DateFormat({ dateStr: room.rateKeyResponses?.rateKeys?.[0]?.cancellationPolicy?.[0]?.from });
        const boardName = room.boardNameResponse?.[0]?.boardName;
        const adults = room.adults;
        const children = room.children;
        const roomImage = room.roomImageUrl?.[0];
        const roomName = room.roomName;

        return (
          <div key={index} className="border p-4 rounded-lg flex gap-4">
            <Image
              src={roomImage}
              alt={roomName}
              loading="lazy"
              className=" object-cover rounded"
              height={148}
              width={148}
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{roomName}</h2>
              <p>Board Basis: {boardName}</p>
              <p>Price: ₹{price}</p>
              <p>Cancellation Policy From: {policyFrom}</p>
              <p>
                Adults: {adults}, Children: {children}
              </p>
              <p>Availability: {room.allotment} room(s) left</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
