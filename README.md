
# Land Measurement 

I have created a smart contract using Solidity to store data related to land measurement on the ethereum blockchain, and used hardhat 
and ether.js to test and deploy the smart contract

Flow of Project:

```shell
1. Admin or owner of contract will assign Inspector who will measure land.
2. All the users(owner of the land) have to link their address to their Aadhaar.
3. Only one Address can be linked to one Aadhaar.
4. Once Aadhar is linked, user can measure his land.
5. Inspector will measure the land of owner and write coordinates of land on blockchain along with owner's Aadhar Hash generated by 'keccak256' and timestamp.
6. User will be given Land Id to check the details of land.
7. Anyone having Land ID can check current Owner of land and all previous Owner and previous Inspector of Land. (All the details of Owner and Inspector will be Hash of their Aadhar Card)
```


## Sequence Diagram

[![](https://mermaid.ink/img/pako:eNqNk92OmzAQhV_F8jWNGiAQfLFSuiu1VbNqtVFvKm5GeLJYWWxqm27TKO_e4SekSVBbJIQ9PvPN8aA58MJI5II7_N6gLvBBwbOFKteMnhqsV4WqQXu2kpXSt-GP2tVYeGNvj746nIi-ezHFrijhBMuHb8d_c3c3AgVbOaee9XWJcXspXiu9I4i06Bzzhq1AlgATOWcDgm0ohCcp-wCu7PWtdZK2n3-QB-X_QEcTbEAzwR4RXEPqNWj5d6tfGleye2OsVBo8Oma2XRZr37bIH6HPr5ro7eqqd2fgpOd1n7I1tgKvjJ5I6lvyHqkAuWBPWKCqPXtVvhzSHyZa2Ml-jPIJxSfEeqRtYIsXmpXeG41kswR7LkqdvCjZq65udl9isbu52YThi2ueCj6hb6yeaEyuecArpL2SND6HlpFzX2KFORe0lGB3Oc_1kXTQeLPZ64ILbxsMeFNLat4waqcgSkU_4bEfx24qA04Tw8WB_-QijJNZFMfpMgkXWZQkURrwPReLdBaGy2UWZnGUzrM0Owb8lzEEfTtL45iEi2gxj5J5lKYd7lt3uIUXh8ff71ZSjA?type=png)](https://mermaid.live/edit#pako:eNqNk92OmzAQhV_F8jWNGiAQfLFSuiu1VbNqtVFvKm5GeLJYWWxqm27TKO_e4SekSVBbJIQ9PvPN8aA58MJI5II7_N6gLvBBwbOFKteMnhqsV4WqQXu2kpXSt-GP2tVYeGNvj746nIi-ezHFrijhBMuHb8d_c3c3AgVbOaee9XWJcXspXiu9I4i06Bzzhq1AlgATOWcDgm0ohCcp-wCu7PWtdZK2n3-QB-X_QEcTbEAzwR4RXEPqNWj5d6tfGleye2OsVBo8Oma2XRZr37bIH6HPr5ro7eqqd2fgpOd1n7I1tgKvjJ5I6lvyHqkAuWBPWKCqPXtVvhzSHyZa2Ml-jPIJxSfEeqRtYIsXmpXeG41kswR7LkqdvCjZq65udl9isbu52YThi2ueCj6hb6yeaEyuecArpL2SND6HlpFzX2KFORe0lGB3Oc_1kXTQeLPZ64ILbxsMeFNLat4waqcgSkU_4bEfx24qA04Tw8WB_-QijJNZFMfpMgkXWZQkURrwPReLdBaGy2UWZnGUzrM0Owb8lzEEfTtL45iEi2gxj5J5lKYd7lt3uIUXh8ff71ZSjA)

