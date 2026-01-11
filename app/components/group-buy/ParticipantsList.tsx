'use client';

import { motion } from 'framer-motion';
import { Users, Clock } from 'lucide-react';

interface Participant {
  name: string;
  avatar: string;
  joinedAt: string;
}

interface ParticipantsListProps {
  participants: Participant[];
}

export default function ParticipantsList({ participants }: ParticipantsListProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-[#F3AF7B]" />
        <h3 className="font-semibold text-gray-800">Recent Participants</h3>
      </div>

      <div className="space-y-3">
        {participants.map((participant, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 bg-white rounded-lg"
          >
            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-full flex items-center justify-center text-white font-semibold">
              {participant.name.split(' ').map(n => n[0]).join('')}
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <p className="font-medium text-gray-800">{participant.name}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {participant.joinedAt}
              </p>
            </div>

            {/* Status */}
            <div className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
              Joined
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <button className="text-sm text-[#F3AF7B] hover:text-[#F3AF7B]/80 font-medium">
          View All Participants
        </button>
      </div>

      {/* Social Proof */}
      <div className="mt-4 p-3 bg-[#E2FBEE] rounded-lg">
        <p className="text-sm text-gray-700 text-center">
          🔥 <strong>847 people</strong> have joined this group buy in the last 24 hours!
        </p>
      </div>
    </div>
  );
}