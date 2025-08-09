pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Escrow is ReentrancyGuard {
    struct Milestone { uint256 amount; bool released; bool funded; }
    struct Project { address client; address freelancer; bool disputed; Milestone[] milestones; }

    mapping(uint256 => Project) public projects;
    uint256 public nextProjectId;

    event ProjectCreated(uint256 indexed projectId, address client, address freelancer);
    event MilestoneFunded(uint256 indexed projectId, uint256 indexed mid, uint256 amount);
    event MilestoneReleased(uint256 indexed projectId, uint256 indexed mid, address to, uint256 amount);
    event DisputeRaised(uint256 indexed projectId);

    function createProject(address freelancer, uint256[] calldata amounts) external returns (uint256) {
        uint256 pid = nextProjectId++;
        Project storage p = projects[pid];
        p.client = msg.sender;
        p.freelancer = freelancer;
        p.disputed = false;
        for (uint i = 0; i < amounts.length; i++) {
            p.milestones.push(Milestone({amount: amounts[i], released: false, funded: false}));
        }
        emit ProjectCreated(pid, msg.sender, freelancer);
        return pid;
    }

    function fundMilestone(uint256 pid, uint256 mid) external payable {
        Project storage p = projects[pid];
        require(msg.sender == p.client, "only client can fund");
        require(!p.disputed, "project disputed");
        require(mid < p.milestones.length, "bad milestone");
        Milestone storage m = p.milestones[mid];
        require(!m.funded, "already funded");
        require(msg.value == m.amount, "send exact amount");
        m.funded = true;
        emit MilestoneFunded(pid, mid, msg.value);
    }

    function approveMilestone(uint256 pid, uint256 mid) external nonReentrant {
        Project storage p = projects[pid];
        require(msg.sender == p.client, "only client");
        require(!p.disputed, "project disputed");
        Milestone storage m = p.milestones[mid];
        require(m.funded, "not funded");
        require(!m.released, "already released");
        m.released = true;
        payable(p.freelancer).transfer(m.amount);
        emit MilestoneReleased(pid, mid, p.freelancer, m.amount);
    }

    function raiseDispute(uint256 pid) external {
        Project storage p = projects[pid];
        require(msg.sender == p.client || msg.sender == p.freelancer, "only parties");
        p.disputed = true;
        emit DisputeRaised(pid);
    }

    function refundMilestone(uint256 pid, uint256 mid) external nonReentrant {
        Project storage p = projects[pid];
        require(p.disputed, "not disputed");
        Milestone storage m = p.milestones[mid];
        require(m.funded && !m.released, "not refundable");
        m.released = true;
        payable(p.client).transfer(m.amount);
    }
}
