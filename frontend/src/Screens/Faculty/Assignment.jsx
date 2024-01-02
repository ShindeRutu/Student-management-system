/**
 * eslint-disable react-hooks/exhaustive-deps
 *
 * @format
 */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import Heading from "../../components/Heading";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";
import { storage } from "../../firebase/config";
import { useSelector } from "react-redux";
import { baseApiURL } from "../../baseUrl";

const Assignment = () => {
	const { fullname } = useSelector((state) => state.userData);
	const [subject, setSubject] = useState();
	const [file, setFile] = useState();
	const [section, setSection] = useState();
	const [semester, setSemester] = useState();
	const [assignment, setAssignment] = useState();
	const [selected, setSelected] = useState("add");
	const [data, setData] = useState({
		semester: "",
		section: "",
		title: "",
		subject: "",
		assignmentNumber: "",
		link: "",
		faculty: fullname.split(" ")[0] + " " + fullname.split(" ")[2],
	});

	useEffect(() => {
		getSectionData();
		getSemesterData();
		getAssignmentHandler();
	}, []);

	useEffect(() => {
		toast.loading("Loading Assignments");
		axios
			.get(`${baseApiURL()}/assignment/getAssignment`)
			.then((response) => {
				toast.dismiss();
				if (response.data.success) {
					setSubject(response.data.assignment);
				} else {
					toast.error(response.data.message);
				}
			})
			.catch((error) => {
				toast.dismiss();
				toast.error(error.message);
			});
	}, []);

	useEffect(() => {
		const uploadFileToStorage = async (file) => {
			toast.loading("Upload Assignment To Storage");
			const storageRef = ref(
				storage,
				`Assignment/${selected.semester}/${selected.section} /${selected.subject}Subject/${selected.title} - ${selected.faculty}`
			);
			const uploadTask = uploadBytesResumable(storageRef, file);
			uploadTask.on(
				"state_changed",
				(snapshot) => {},
				(error) => {
					console.error(error);
					toast.dismiss();
					toast.error("Something Went Wrong!");
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						toast.dismiss();
						setFile();
						toast.success("assignment Uploaded To Storage");
						setSelected({ ...selected, link: downloadURL });
					});
				}
			);
		};
		file && uploadFileToStorage(file);
	}, [file]);

	const getAssignmentHandler = () => {
		axios
			.get(`${baseApiURL()}/assignment/getAssignment`)
			.then((response) => {
				if (response.data.success) {
					setAssignment(response.data.assignment);
				} else {
					toast.error(response.data.message);
				}
			})
			.catch((error) => {
				toast.error(error.message);
			});
	};

	const getSectionData = () => {
		const headers = {
			"Content-Type": "application/json",
		};
		axios
			.get(`${baseApiURL()}/section/getSection`, { headers })
			.then((response) => {
				if (response.data.success) {
					setSection(response.data.sections);
				} else {
					toast.error(response.data.message);
				}
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const getSemesterData = () => {
		const headers = {
			"Content-Type": "application/json",
		};
		axios
			.get(`${baseApiURL()}/semester/getSemester`, { headers })
			.then((response) => {
				if (response.data.success) {
					setSemester(response.data.semesters);
				} else {
					toast.error(response.data.message);
				}
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const addAssignmentHandler = () => {
		toast.loading("Adding Assignment");
		const headers = {
			"Content-Type": "application/json",
		};
		axios
			.post(`${baseApiURL()}/assignment/addAssignment`, data, {
				headers: headers,
			})
			.then((response) => {
				toast.dismiss();
				if (response.data.success) {
					toast.success(response.data.message);
					setData({
						semester: "",
						section: "",
						assignmentNumber: "",
						subject: "",
						title: "",
						link: "",
						faculty: fullname.split(" ")[0] + " " + fullname.split(" ")[2],
					});
					setFile("");
					getAssignmentHandler();
				} else {
					toast.error(response.data.message);
				}
			})
			.catch((error) => {
				toast.dismiss();
				toast.error(error.response.data.message);
			});
	};

	const deleteAssignmentHandler = (id) => {
		toast.loading("deleting assignment");
		const headers = {
			"Content-Type": "application/json",
		};
		axios
			.delete(`${baseApiURL()}/assigment/deleteAssignment/${id}`, {
				headers: headers,
			})
			.then((response) => {
				toast.dismiss();
				if (response.data.success) {
					toast.success(response.data.message);
					getAssignmentHandler();
				} else {
					toast.error(response.data.message);
				}
			})
			.catch((error) => {
				toast.dismiss();
				toast.error(error.response.data.message);
			});
	};

	return (
		<div className='w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10'>
			<div className='flex justify-between items-center w-full'>
				<Heading title={`Upload Assignment`} />
				<div className='w-full flex justify-end items-center '>
					<button
						className={`${
							selected === "add" && "border-b-2 "
						}border-blue-500 px-4 py-2 text-black rounded-sm mr-6`}
						onClick={() => setSelected("add")}
					>
						Add Assignment
					</button>
					<button
						className={`${
							selected === "view" && "border-b-2 "
						}border-blue-500 px-4 py-2 text-black rounded-sm`}
						onClick={() => setSelected("view")}
					>
						View Assignment
					</button>
				</div>
			</div>
			{selected === "add" && (
				<div className='w-full mt-8 flex flex-col justify-center items-center'>
					<div className='w-[40%] mb-4'>
						<input
							type='number'
							id='assigmentNumber'
							placeholder='Assignment Number'
							className='bg-blue-50 py-2 px-4 w-full mt-1'
							value={data.assignmentNumber}
							onChange={(e) =>
								setData({ ...data, assignmentNumber: e.target.value })
							}
						/>
					</div>
					<div className='w-[40%] mb-4'>
						<input
							type='text'
							id='title'
							placeholder='Title'
							name='title'
							className='bg-blue-50 py-2 px-4 w-full mt-1'
							value={data.title}
							onChange={(e) => setData({ ...data, title: e.target.value })}
						/>
					</div>
					<div className='w-[40%] mb-4'>
						<select
							value={data.subject}
							name='subject'
							id='subject'
							onChange={(e) => setData({ ...data, subject: e.target.value })}
							className='px-2 bg-blue-50 py-3 rounded-sm text-base accent-blue-700 mt-1 w-full'
						>
							<option
								defaultValue
								value='select'
							>
								-- Select Subject --
							</option>
							{subject &&
								subject.map((item) => {
									return (
										<option
											value={item.name}
											key={item.name}
										>
											{item.name}
										</option>
									);
								})}
						</select>
						<select
							onChange={(e) => setData({ ...data, semester: e.target.value })}
							value={data.semester}
							name='semester'
							id='semester'
							className='px-2 bg-blue-50 py-3 rounded-sm text-base w-[80%] accent-blue-700 mt-4'
						>
							<option defaultValue>-- Select Class --</option>
							<option value='11'>11th</option>
							<option value='12'>12th</option>
						</select>
						<select
							onChange={(e) => setData({ ...data, section: e.target.value })}
							value={data.section}
							name='section'
							id='section'
							className='px-2 bg-blue-50 py-3 rounded-sm text-base w-[80%] accent-blue-700 mt-4'
						>
							<option defaultValue>-- Select Section--</option>
							{section &&
								section.map((section) => {
									return (
										<option
											value={section.name}
											key={section.name}
										>
											{section.name}
										</option>
									);
								})}
						</select>
					</div>
					{!data.link && (
						<label
							htmlFor='upload'
							className='px-2 bg-blue-50 py-3 rounded-sm text-base w-[80%] mt-4 flex justify-center items-center cursor-pointer'
						>
							Upload Assignment
							<span className='ml-2'>
								<FiUpload />
							</span>
						</label>
					)}
					{data.link && (
						<p
							className='px-2 border-2 border-blue-500 py-2 rounded text-base w-[80%] mt-4 flex justify-center items-center cursor-pointer'
							onClick={() => setData({ ...data, link: "" })}
						>
							Remove Selected Assignmnet
							<span className='ml-2'>
								<AiOutlineClose />
							</span>
						</p>
					)}
					<input
						type='file'
						name='upload'
						id='upload'
						accept='.pdf'
						hidden
						onChange={(e) => setFile(e.target.files[0])}
					/>
					<button
						className='bg-blue-500 text-white mt-8 px-4 py-2 rounded-sm'
						onClick={addAssignmentHandler}
					>
						Add Assignment
					</button>
				</div>
			)}
			{selected === "view" && (
				<div className='mt-8 w-full'>
					<ul>
						{assignment &&
							assignment.map((item) => {
								return (
									<li
										key={item.assignmentNumber}
										className='bg-blue-100 py-3 px-6 mb-3 flex justify-between items-center w-[70%]'
									>
										<div>
											{item.assignmentNumber} - {item.name}
										</div>
										<button
											className='text-2xl hover:text-red-500'
											onClick={() => deleteAssignmentHandler(item._id)}
										>
											<MdOutlineDelete />
										</button>
									</li>
								);
							})}
					</ul>
				</div>
			)}
		</div>
	);
};

export default Assignment;
