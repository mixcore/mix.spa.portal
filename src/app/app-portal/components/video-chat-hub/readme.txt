- Must use stun / turn server to streaming cross network
  ex: _iceServers = [
                {"urls": "stun:ec2-54-176-1-181.us-west-1.compute.amazonaws.com:3478"},
                {"urls": "turn:openrelay.metered.ca:443",
                "username":"openrelayproject", "credential":"openrelayproject"}], // stun.l.google.com - Firefox does not support DNS names.
